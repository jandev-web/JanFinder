import os
import boto3
from io import BytesIO
import zipfile
import decimal
from docx import Document  # you already import it
import json
import base64

try:
    import lxml.etree as etree
    print("LXML import successful")
except Exception as e:
    print(f"Import error: {e}")
    # You MUST ship lxml via a layer, see notes below.

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')

CUSTOMER_QUOTES_TABLE = os.environ.get('CUSTOMER_QUOTES_TABLE', 'CustomerQuotes')
OWNER_TABLE = os.environ.get('OWNER_TABLE', 'Owner_DB')
FRANCHISE_TABLE = os.environ.get('FRANCHISE_TABLE', 'Franchise_DB')
QUOTE_PDF_BUCKET_NAME = os.environ.get('QUOTE_PDF_BUCKET_NAME', '')
CONVERT_LAMBDA_NAME = os.environ.get('CONVERT_LAMBDA_NAME', 'convertDocxtoPDF')

def invoke_convert_lambda(quote_id, docx_key, pdf_key):
    payload = json.dumps({
        "quoteID": quote_id,
        "docx_key": docx_key,
        "pdf_key": pdf_key
    })
    print(f"Invoking conversion Lambda '{CONVERT_LAMBDA_NAME}'")
    response = lambda_client.invoke(
        FunctionName=CONVERT_LAMBDA_NAME,
        InvocationType='RequestResponse',
        Payload=payload
    )
    raw = response['Payload'].read()
    print("Conversion Lambda raw response:", raw)
    try:
        result = json.loads(raw)
    except Exception as e:
        raise Exception(f"Error parsing conversion Lambda response: {e}")

    if result.get("isBase64Encoded"):
        pdf_data = base64.b64decode(result.get("body"))
    else:
        pdf_data = result.get("body")
    print("Received PDF data size:", len(pdf_data) if pdf_data else "No data")
    return pdf_data

def generate_package_details(package_info):
    details = []
    if package_info and package_info.get('rooms'):
        for room in package_info['rooms']:
            room_details = f"Room: {room.get('roomName','Unknown')}\n"
            tasks = "\n".join([f"- {t['taskName']} ({t.get('taskFrequency','')})" for t in room.get('tasks', [])])
            room_details += tasks
            details.append(room_details)
    return "\n\n".join(details)

def replace_placeholders_in_textboxes(doc_stream, placeholders):
    with zipfile.ZipFile(doc_stream, 'r') as docx_zip:
        xml_files = [f for f in docx_zip.namelist() if f.startswith('word/') and f.endswith('.xml')]
        updated_xml_content = {}
        for file in xml_files:
            with docx_zip.open(file) as f:
                xml_content = f.read().decode('utf-8')
                tree = etree.fromstring(xml_content.encode('utf-8'))

                for placeholder, replacement in placeholders.items():
                    text_elements = tree.xpath(
                        f"//w:t[contains(text(), '{placeholder}')]",
                        namespaces={'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                    )
                    for text_element in text_elements:
                        text_element.text = text_element.text.replace(placeholder, str(replacement))

                updated_xml_content[file] = etree.tostring(tree, encoding='utf-8').decode('utf-8')

        updated_doc_stream = BytesIO()
        with zipfile.ZipFile(updated_doc_stream, 'w') as new_docx:
            for file in docx_zip.namelist():
                with docx_zip.open(file) as orig:
                    if file in updated_xml_content:
                        new_docx.writestr(file, updated_xml_content[file].encode('utf-8'))
                    else:
                        new_docx.writestr(file, orig.read())
        updated_doc_stream.seek(0)
        return updated_doc_stream

def fetch_dynamodb_item(table_name, key_name, key_value):
    table = dynamodb.Table(table_name)
    resp = table.get_item(Key={key_name: key_value})
    return resp.get('Item')

def lambda_handler(event, context):
    try:
        body = event.get('body', {})
        if isinstance(body, str):
            body = json.loads(body)

        quote_id = body.get('quoteID')
        if not quote_id:
            return {'statusCode': 400, 'body': json.dumps({'message': 'Missing quoteID'})}

        docx_key = f"protected/quotes/{quote_id}/quote.docx"
        pdf_key  = f"protected/quotes/{quote_id}/quote.pdf"
        pdf_url  = f"https://{QUOTE_PDF_BUCKET_NAME}.s3.amazonaws.com/{pdf_key}"

        quote = fetch_dynamodb_item(CUSTOMER_QUOTES_TABLE, 'QuoteID', quote_id)
        if not quote:
            return {'statusCode': 404, 'body': json.dumps({'message': 'Quote not found'})}

        owner_id     = quote.get('OwnerID')
        franchise_id = quote.get('Franchise')

        owner_info     = fetch_dynamodb_item(OWNER_TABLE, 'OwnerID', owner_id)
        franchise_info = fetch_dynamodb_item(FRANCHISE_TABLE, 'FranchiseID', franchise_id)
        if not owner_info or not franchise_info:
            return {'statusCode': 404, 'body': json.dumps({'message': 'Owner or Franchise not found'})}

        template_key = f"protected/quote-templates/{franchise_id}/quote-template.docx"
        s3_response = s3.get_object(Bucket=QUOTE_PDF_BUCKET_NAME, Key=template_key)
        doc_template = BytesIO(s3_response['Body'].read())

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

        updated_doc_stream = replace_placeholders_in_textboxes(doc_template, placeholders)
        s3.put_object(
            Bucket=QUOTE_PDF_BUCKET_NAME,
            Key=docx_key,
            Body=updated_doc_stream.getvalue(),
            ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

        invoke_convert_lambda(quote_id, docx_key, pdf_key)

        # write QuotePDF URL
        customer_quotes_table = dynamodb.Table(CUSTOMER_QUOTES_TABLE)
        customer_quotes_table.update_item(
            Key={'QuoteID': quote_id},
            UpdateExpression="SET QuotePDF = :url",
            ExpressionAttributeValues={':url': pdf_url}
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Contract created successfully', 'contractURL': pdf_url})
        }

    except Exception as e:
        print("Error:", e)
        return {'statusCode': 500, 'body': json.dumps({'message': 'Error processing request', 'error': str(e)})}
