import os, json, boto3, zipfile, re, base64, traceback
from io import BytesIO

s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')

TEMPLATE_BUCKET = os.environ.get('TEMPLATE_BUCKET') or os.environ.get('QUOTE_PDF_BUCKET_NAME', '')
OUTPUT_BUCKET   = os.environ.get('OUTPUT_BUCKET')   or TEMPLATE_BUCKET
FILL_LAMBDA     = os.environ.get('FILL_LAMBDA_NAME', 'fill-docx-placeholders')
CONVERT_LAMBDA  = os.environ.get('CONVERT_LAMBDA_NAME', 'convert-docx-to-pdf')

def _ok(body, rid):    return {"statusCode": 200, "body": json.dumps(body), "requestId": rid}
def _bad(msg, rid, issues=None, code=400):
    return {"statusCode": code, "body": json.dumps({"message": msg, "issues": issues or []}), "requestId": rid}

def _log(rid, msg, **kv):
    print(f"[validate-quote-template][{rid}] {msg} :: {json.dumps(kv, default=str)}")

PLACEHOLDER_RE = re.compile(r"\[[A-Z0-9_/-]+\]")

REQUIRED_BLOCKS = [
    ("[ROOMS_START]", "[ROOMS_END]"),
    ("[HARDFLOOR_TASKS_START]", "[HARDFLOOR_TASKS_END]"),
    ("[CARPET_TASKS_START]", "[CARPET_TASKS_END]"),
]

SUGGESTED_FIELDS = [
    "[CUSTOMER_NAME]", "[SELECTED_PACKAGE_NAME]", "[SELECTED_PACKAGE_COST]",
    "[SELECTED_TOTAL_MONTH_TIME]", "[HARDFLOOR_TOTAL_MONTH_TIME]", "[CARPET_TOTAL_MONTH_TIME]"
]

def _list_docx_placeholders(bucket, key, rid):
    _log(rid, "Fetching template for scan", bucket=bucket, key=key)
    obj = s3.get_object(Bucket=bucket, Key=key)
    data = obj["Body"].read()

    ph = set()
    with zipfile.ZipFile(BytesIO(data), 'r') as z:
        for name in z.namelist():
            if not (name.startswith('word/') and name.endswith('.xml')): 
                continue
            txt = z.read(name).decode('utf-8', errors='ignore')
            ph.update(PLACEHOLDER_RE.findall(txt))
    return ph

def _build_test_placeholders(franchise_id):
    # Minimal realistic test values (kept short to avoid line wrapping)
    return {
        "[FRANCHISE_ID]": franchise_id,
        "[FRANCHISE_NAME]": "Test Franchise",
        "[CUSTOMER_NAME]": "Pat Customer",
        "[CUSTOMER_EMAIL]": "pat@example.com",
        "[CUSTOMER_PHONE]": "555-0100",
        "[FACILITY_TYPE]": "Office",
        "[TOTAL_SQFT]": "12,345",
        "[SERVICE_FREQUENCY]": "Daily",
        "[SELECTED_PACKAGE_NAME]": "Standard",
        "[SELECTED_PACKAGE_COST]": "$1,234.56",
        "[SELECTED_TOTAL_MONTH_TIME]": "9876.5",
        "[HARDFLOOR_TOTAL_MONTH_TIME]": "1200",
        "[CARPET_TOTAL_MONTH_TIME]": "800",
        "[QUOTE_TIMESTAMP]": "Jan 01, 2025 3:42 PM",
        "[CONFIRMATION_NUMBER]": "TEST-12345",
        "[CONFIRMATION_TIMESTAMP]": "Jan 01, 2025 3:45 PM",
        # add more if your template references them
    }

def _build_test_blocks():
    rooms_block = "\n".join([
        "• Lobby (x1, 1500 sqft)",
        "  Tasks:",
        "    – Dust Horizontal Surfaces — Daily — 120 min/month",
        "    – Empty Trash — Daily — 90 min/month",
        "  Room Total: 210 min/month",
        "",
        "• Breakroom (x1, 300 sqft)",
        "  Tasks:",
        "    – Wipe Counters — Daily — 60 min/month",
        "    – Clean Microwave — Weekly — 20 min/month",
        "  Room Total: 80 min/month",
    ])
    hf_block = "– Dust Mop — Daily — 300 min/month\n– Damp Mop — Weekly — 120 min/month"
    cf_block = "– Spot Vacuum — Daily — 200 min/month\n– Edge Vacuum — Weekly — 60 min/month"

    return [
        {"start": "[ROOMS_START]", "end": "[ROOMS_END]", "text": rooms_block},
        {"start": "[HARDFLOOR_TASKS_START]", "end": "[HARDFLOOR_TASKS_END]", "text": hf_block},
        {"start": "[CARPET_TASKS_START]", "end": "[CARPET_TASKS_END]", "text": cf_block},
    ]

def lambda_handler(event, context):
    rid = (event or {}).get("requestId") or getattr(context, "aws_request_id", "no-context")
    _log(rid, "START", event=event, env={
        "TEMPLATE_BUCKET": TEMPLATE_BUCKET,
        "OUTPUT_BUCKET": OUTPUT_BUCKET,
        "FILL_LAMBDA_NAME": FILL_LAMBDA,
        "CONVERT_LAMBDA_NAME": CONVERT_LAMBDA
    })

    try:
        args = event.get("arguments") or event.get("body") or {}
        if isinstance(args, str):
            try: args = json.loads(args)
            except: args = {}
        franchise_id = args.get("franchiseID")
        if not franchise_id:
            return _bad("Missing franchiseID", rid, code=400)

        # ensure template path
        template_key = f"members/franchise/{franchise_id}/templates/quote/quote-template.docx"
        test_docx_key = f"members/franchise/{franchise_id}/templates/quote/quote-template-test.docx"
        test_pdf_key  = f"members/franchise/{franchise_id}/templates/quote/quote-template-test.pdf"
        test_pdf_url  = f"https://{OUTPUT_BUCKET}.s3.amazonaws.com/{test_pdf_key}"

        # 1) validate file exists & is .docx
        try:
            head = s3.head_object(Bucket=TEMPLATE_BUCKET, Key=template_key)
        except Exception as e:
            _log(rid, "Template missing", error=str(e))
            return _bad("Template not found. Please upload a .docx file.", rid)

        if not template_key.lower().endswith(".docx"):
            return _bad("Wrong file format. Please upload a .docx file.", rid)

        # 2) scan placeholders
        found = _list_docx_placeholders(TEMPLATE_BUCKET, template_key, rid)
        issues = []

        # missing block pairs?
        for start, end in REQUIRED_BLOCKS:
            if not (start in found and end in found):
                issues.append(f"Missing block marker(s): {start} … {end}")

        # suggest common fields if absent
        for f in SUGGESTED_FIELDS:
            if f not in found:
                issues.append(f"Placeholder recommended but not found: {f}")

        # 3) test fill (even if there are issues, we still try, and report back)
        placeholders = _build_test_placeholders(franchise_id)

        # Only pass placeholders that exist in the file to avoid littering output
        used_placeholders = {k: v for k, v in placeholders.items() if k in found}

        blocks = _build_test_blocks()

        # invoke fill-docx-placeholders
        fill_payload = {
            "template_bucket": TEMPLATE_BUCKET,
            "template_key": template_key,
            "output_bucket": OUTPUT_BUCKET,
            "docx_key": test_docx_key,
            "placeholders": used_placeholders,
            "blocks": blocks,
            "requestId": rid
        }
        _log(rid, "Invoking fill-docx", payload=fill_payload)
        fill_resp = lambda_client.invoke(
            FunctionName=FILL_LAMBDA,
            InvocationType='RequestResponse',
            Payload=json.dumps(fill_payload).encode('utf-8'),
        )
        raw = fill_resp['Payload'].read().decode('utf-8')
        try: fill_body = json.loads(raw)
        except: fill_body = {"raw": raw}

        if (isinstance(fill_body, dict) and fill_body.get("statusCode", 200) >= 400):
            return _bad("Template fill failed. Check your placeholders.", rid, issues + ["Fill error: " + (fill_body.get("body") or str(fill_body))], 500)

        # invoke convert-docx-to-pdf
        conv_payload = {
            "bucket": OUTPUT_BUCKET,
            "docx_key": test_docx_key,
            "pdf_key": test_pdf_key,
            "requestId": rid
        }
        _log(rid, "Invoking convert", payload=conv_payload)
        conv_resp = lambda_client.invoke(
            FunctionName=CONVERT_LAMBDA,
            InvocationType='RequestResponse',
            Payload=json.dumps(conv_payload).encode('utf-8'),
        )
        raw2 = conv_resp['Payload'].read().decode('utf-8')
        try: conv_body = json.loads(raw2)
        except: conv_body = {"raw": raw2}

        if (isinstance(conv_body, dict) and conv_body.get("statusCode", 200) >= 400):
            return _bad("PDF conversion failed.", rid, issues + ["Convert error: " + (conv_body.get("body") or str(conv_body))], 500)

        # done
        return _ok({"pdfUrl": test_pdf_url, "issues": issues}, rid)

    except Exception as e:
        _log(rid, "FATAL", error=str(e), traceback=traceback.format_exc())
        return _bad("Unexpected error while testing template.", rid, [str(e)], 500)
