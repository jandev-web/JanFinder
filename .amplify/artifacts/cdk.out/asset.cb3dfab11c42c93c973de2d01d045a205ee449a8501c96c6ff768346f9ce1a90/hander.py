import os, json, boto3, zipfile, re, traceback, mimetypes
from io import BytesIO
from datetime import datetime, timedelta, timezone

s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')

BUCKET = os.environ.get('TEMPLATE_BUCKET') or os.environ.get('OUTPUT_BUCKET') or ''
PUBLIC_PREFIX = 'public/'
FILL_LAMBDA = os.environ.get('FILL_LAMBDA_NAME', 'fill-docx-placeholders')
CONVERT_LAMBDA = os.environ.get('CONVERT_LAMBDA_NAME', 'convert-docx-to-pdf')

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

def _ok(body, rid):    return {"statusCode": 200, "body": json.dumps(body), "requestId": rid}
def _bad(msg, rid, issues=None, code=400):
    return {"statusCode": code, "body": json.dumps({"message": msg, "issues": issues or []}), "requestId": rid}

def _list_docx_placeholders(bucket, key):
    obj = s3.get_object(Bucket=bucket, Key=key)
    data = obj["Body"].read()

    # quick “is it a ZIP” test (docx is a zip)
    if not data.startswith(b'PK'):
        raise ValueError("File is not a DOCX (zip)")

    found = set()
    with zipfile.ZipFile(BytesIO(data), 'r') as z:
        for name in z.namelist():
            if not (name.startswith('word/') and name.endswith('.xml')):
                continue
            try:
                txt = z.read(name).decode('utf-8', errors='ignore')
                found.update(PLACEHOLDER_RE.findall(txt))
            except Exception:
                # ignore decoding errors per part
                pass
    return found

def _build_test_placeholders(franchise_id):
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

def _presigned(bucket, key, minutes=30):
    return s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={'Bucket': bucket, 'Key': key},
        ExpiresIn=minutes * 60,
    )

def lambda_handler(event, context):
    rid = getattr(context, "aws_request_id", "no-context")
    try:
        args = (event or {}).get("arguments") or (event or {}).get("body") or {}
        if isinstance(args, str):
            try: args = json.loads(args)
            except: args = {}
        franchise_id = args.get("franchiseID")
        if not franchise_id:
            return _bad("Missing franchiseID", rid, code=400)

        # Keys (note PUBLIC_PREFIX)
        base = f"{PUBLIC_PREFIX}members/franchise/{franchise_id}/templates/quote"
        template_key = f"{base}/quote-template.docx"
        test_docx_key = f"{base}/quote-template-test.docx"
        test_pdf_key  = f"{base}/quote-template-test.pdf"

        # 1) validate exists & looks like docx
        try:
            s3.head_object(Bucket=BUCKET, Key=template_key)
        except Exception:
            return _bad("Template not found. Please upload a .docx file.", rid)

        if not template_key.lower().endswith(".docx"):
            return _bad("Wrong file format. Please upload a .docx file.", rid)

        # 2) scan placeholders
        try:
            found = _list_docx_placeholders(BUCKET, template_key)
        except ValueError as ve:
            return _bad(str(ve), rid)
        except Exception as e:
            return _bad("Could not read DOCX content.", rid, [str(e)], 500)

        issues = []
        for start, end in REQUIRED_BLOCKS:
            if start not in found or end not in found:
                issues.append(f"Missing block marker(s): {start} … {end}")

        for f in SUGGESTED_FIELDS:
            if f not in found:
                issues.append(f"Placeholder recommended but not found: {f}")

        # 3) test fill
        placeholders = _build_test_placeholders(franchise_id)
        used_placeholders = {k: v for k, v in placeholders.items() if k in found}
        blocks = _build_test_blocks()

        fill_payload = {
            "template_bucket": BUCKET,
            "template_key": template_key,
            "output_bucket": BUCKET,
            "docx_key": test_docx_key,
            "placeholders": used_placeholders,
            "blocks": blocks,
            "requestId": rid
        }
        fill_resp = lambda_client.invoke(
            FunctionName=FILL_LAMBDA,
            InvocationType='RequestResponse',
            Payload=json.dumps(fill_payload).encode('utf-8'),
        )
        raw = fill_resp['Payload'].read().decode('utf-8') if fill_resp.get('Payload') else ''
        try: fill_body = json.loads(raw)
        except: fill_body = {"raw": raw}
        if isinstance(fill_body, dict) and fill_body.get("statusCode", 200) >= 400:
            return _bad("Template fill failed. Check your placeholders.", rid,
                        issues + ["Fill error: " + (fill_body.get("body") or str(fill_body))], 500)

        # 4) convert to PDF
        conv_payload = {"bucket": BUCKET, "docx_key": test_docx_key, "pdf_key": test_pdf_key, "requestId": rid}
        conv_resp = lambda_client.invoke(
            FunctionName=CONVERT_LAMBDA,
            InvocationType='RequestResponse',
            Payload=json.dumps(conv_payload).encode('utf-8'),
        )
        raw2 = conv_resp['Payload'].read().decode('utf-8') if conv_resp.get('Payload') else ''
        try: conv_body = json.loads(raw2)
        except: conv_body = {"raw": raw2}
        if isinstance(conv_body, dict) and conv_body.get("statusCode", 200) >= 400:
            return _bad("PDF conversion failed.", rid,
                        issues + ["Convert error: " + (conv_body.get("body") or str(conv_body))], 500)

        # 5) return presigned URL + issues
        pdf_url = _presigned(BUCKET, test_pdf_key, minutes=60)
        return _ok({"pdfUrl": pdf_url, "issues": issues}, rid)

    except Exception as e:
        return _bad("Unexpected error while testing template.", rid, [str(e), traceback.format_exc()], 500)
