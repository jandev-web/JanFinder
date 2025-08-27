import os, boto3, json, base64, traceback
from io import BytesIO
import zipfile

try:
    import lxml.etree as etree
    print("LXML import successful")
except Exception as e:
    print("LXML import failed:", e)

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')

CUSTOMER_QUOTES_TABLE = os.environ.get('CUSTOMER_QUOTES_TABLE', 'CustomerQuotes')
OWNER_TABLE = os.environ.get('OWNER_TABLE', 'Owner_DB')
FRANCHISE_TABLE = os.environ.get('FRANCHISE_TABLE', 'Franchise_DB')
QUOTE_PDF_BUCKET_NAME = os.environ.get('QUOTE_PDF_BUCKET_NAME', '')
CONVERT_LAMBDA_NAME = os.environ.get('CONVERT_LAMBDA_NAME', 'convertDocxtoPDF')

def _log(rid, msg, **kv):
    print(f"[get-quote-pdf][{rid}] {msg} :: {json.dumps(kv, default=str)}")

def invoke_convert_lambda(quote_id, docx_key, pdf_key, rid):
    payload = {"quoteID": quote_id, "docx_key": docx_key, "pdf_key": pdf_key, "requestId": rid}
    _log(rid, "Invoking convert lambda", function=CONVERT_LAMBDA_NAME, payload=payload)
    resp = lambda_client.invoke(
        FunctionName=CONVERT_LAMBDA_NAME,
        InvocationType='RequestResponse',
        Payload=json.dumps(payload).encode('utf-8'),
    )
    status = resp.get('StatusCode')
    fn_error = resp.get('FunctionError')
    raw = resp['Payload'].read().decode('utf-8') if 'Payload' in resp else ''
    body = None
    try:
        body = json.loads(raw)
    except Exception:
        body = {"raw": raw}
    _log(rid, "Convert lambda response", status=status, functionError=fn_error, body=body)
    if fn_error or (isinstance(body, dict) and body.get('statusCode', 200) >= 400):
        raise Exception(f"convertDocxtoPDF error: status={status}, fnError={fn_error}, body={body}")
    return body

def generate_package_details(package_info):
    details = []
    if package_info and package_info.get('rooms'):
        for room in package_info['rooms']:
            name = room.get('roomName', 'Unknown')
            tasks = "\n".join([f"- {t.get('taskName','')} ({t.get('taskFrequency','')})" for t in room.get('tasks', [])])
            details.append(f"Room: {name}\n{tasks}")
    return "\n\n".join(details)

def replace_placeholders_in_textboxes(doc_stream, placeholders, rid):
    with zipfile.ZipFile(doc_stream, 'r') as docx_zip:
        xml_files = [f for f in docx_zip.namelist() if f.startswith('word/') and f.endswith('.xml')]
        _log(rid, "XML files to process", count=len(xml_files))
        updated_xml_content = {}
        for file in xml_files:
            xml_content = docx_zip.read(file).decode('utf-8')
            tree = etree.fromstring(xml_content.encode('utf-8'))
            replaced = 0
            for placeholder, replacement in placeholders.items():
                text_elements = tree.xpath(
                    f"//w:t[contains(text(), '{placeholder}')]",
                    namespaces={'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                )
                for te in text_elements:
                    te.text = te.text.replace(placeholder, str(replacement))
                    replaced += 1
            updated_xml_content[file] = etree.tostring(tree, encoding='utf-8').decode('utf-8')
            _log(rid, "File processed", file=file, replacements=replaced)

        updated_doc_stream = BytesIO()
        with zipfile.ZipFile(updated_doc_stream, 'w') as new_docx:
            for file in docx_zip.namelist():
                if file in updated_xml_content:
                    new_docx.writestr(file, updated_xml_content[file].encode('utf-8'))
                else:
                    new_docx.writestr(file, docx_zip.read(file))
        updated_doc_stream.seek(0)
        return updated_doc_stream

def fetch_dynamodb_item(table_name, key_name, key_value, rid):
    table = dynamodb.Table(table_name)
    _log(rid, "DDB get", table=table_name, keyName=key_name, keyValue=key_value)
    resp = table.get_item(Key={key_name: key_value})
    item = resp.get('Item')
    _log(rid, "DDB get result", found=bool(item))
    return item

def lambda_handler(event, context):
    rid = (event or {}).get("requestId") or getattr(context, "aws_request_id", "no-context")
    _log(rid, "START", env={
        "CUSTOMER_QUOTES_TABLE": CUSTOMER_QUOTES_TABLE,
        "OWNER_TABLE": OWNER_TABLE,
        "FRANCHISE_TABLE": FRANCHISE_TABLE,
        "QUOTE_PDF_BUCKET_NAME": QUOTE_PDF_BUCKET_NAME,
        "CONVERT_LAMBDA_NAME": CONVERT_LAMBDA_NAME,
    }, event=event)

    try:
        body = event.get('body', {})
        if isinstance(body, str):
            body = json.loads(body)
        quote_id = body.get('quoteID')
        if not quote_id:
            _log(rid, "Missing quoteID")
            return {'statusCode': 400, 'body': json.dumps({'message': 'Missing quoteID'}), 'requestId': rid}

        docx_key = f"protected/quotes/{quote_id}/quote.docx"
        pdf_key  = f"protected/quotes/{quote_id}/quote.pdf"
        pdf_url  = f"https://{QUOTE_PDF_BUCKET_NAME}.s3.amazonaws.com/{pdf_key}"
        _log(rid, "S3 keys", docx_key=docx_key, pdf_key=pdf_key, pdf_url=pdf_url)

        quote = fetch_dynamodb_item(CUSTOMER_QUOTES_TABLE, 'QuoteID', quote_id, rid)
        if not quote:
            _log(rid, "Quote not found")
            return {'statusCode': 404, 'body': json.dumps({'message': 'Quote not found'}), 'requestId': rid}

        owner_id     = quote.get('OwnerID')
        franchise_id = quote.get('Franchise')
        _log(rid, "Quote ownership", ownerID=owner_id, franchiseID=franchise_id)

        owner_info     = fetch_dynamodb_item(OWNER_TABLE, 'OwnerID', owner_id, rid)
        franchise_info = fetch_dynamodb_item(FRANCHISE_TABLE, 'FranchiseID', franchise_id, rid)
        if not owner_info or not franchise_info:
            _log(rid, "Owner/Franchise missing")
            return {'statusCode': 404, 'body': json.dumps({'message': 'Owner or Franchise not found'}), 'requestId': rid}

        template_key = f"protected/quote-templates/{franchise_id}/quote-template.docx"
        _log(rid, "S3 get template", bucket=QUOTE_PDF_BUCKET_NAME, key=template_key)
        s3_response = s3.get_object(Bucket=QUOTE_PDF_BUCKET_NAME, Key=template_key)
        doc_template = BytesIO(s3_response['Body'].read())
        _log(rid, "Template loaded", size=len(doc_template.getvalue()))

        quote_info   = quote.get('quoteInfo', {})
        customer     = quote.get('customerData', {})
        package_data = quote.get('Package', {})
        cost_info    = quote.get('costInfo', {})

        placeholders = {
            '{CLIENT_NAME}': f"{customer.get('firstName','')} {customer.get('lastName','')}",
            '{EMAIL}': customer.get('email','N/A'),
            '{FACILITY_TYPE}': quote_info.get('facilityType','N/A'),
            '{FREQUENCY}': quote_info.get('frequency','N/A'),
            '{OWNER_NAME}': f"{owner_info.get('firstName','')} {owner_info.get('lastName','')}",
            '{OWNER_EMAIL}': owner_info.get('email','N/A'),
            '{OWNER_PHONE}': owner_info.get('phone','N/A'),
            '{FRANCHISE_NAME}': franchise_info.get('Name','N/A'),
            '{FRANCHISE_CONTACT}': franchise_info.get('Contact','N/A'),
            '{PACKAGE_INFO}': generate_package_details(package_data),
            '{COST}': cost_info.get('finalCost','N/A')
        }
        _log(rid, "Placeholders prepared", count=len(placeholders))

        updated_doc_stream = replace_placeholders_in_textboxes(doc_template, placeholders, rid)
        _log(rid, "Uploading updated DOCX", bucket=QUOTE_PDF_BUCKET_NAME, key=docx_key)
        s3.put_object(
            Bucket=QUOTE_PDF_BUCKET_NAME,
            Key=docx_key,
            Body=updated_doc_stream.getvalue(),
            ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

        # Convert to PDF
        invoke_convert_lambda(quote_id, docx_key, pdf_key, rid)

        # Write QuotePDF URL
        _log(rid, "Updating DDB with PDF URL", table=CUSTOMER_QUOTES_TABLE, quoteID=quote_id, url=pdf_url)
        customer_quotes_table = dynamodb.Table(CUSTOMER_QUOTES_TABLE)
        customer_quotes_table.update_item(
            Key={'QuoteID': quote_id},
            UpdateExpression="SET QuotePDF = :url",
            ExpressionAttributeValues={':url': pdf_url}
        )

        _log(rid, "DONE")
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Contract created successfully', 'contractURL': pdf_url}),
            'requestId': rid
        }

    except Exception as e:
        _log(rid, "FATAL", error=str(e), traceback=traceback.format_exc())
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error processing request', 'error': str(e)}),
            'requestId': rid
        }
