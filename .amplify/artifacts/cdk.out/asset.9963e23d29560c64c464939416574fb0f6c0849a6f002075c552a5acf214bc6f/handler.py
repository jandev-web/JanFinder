import os, json, boto3, botocore

s3 = boto3.client('s3')
lam = boto3.client('lambda')

TEMPLATE_BUCKET = os.environ['TEMPLATE_BUCKET']
OUTPUT_BUCKET   = os.environ['OUTPUT_BUCKET']
FILL_LAMBDA     = os.environ['FILL_LAMBDA_NAME']
CONVERT_LAMBDA  = os.environ['CONVERT_LAMBDA_NAME']

def _invoke_lambda(name, payload):
    resp = lam.invoke(
        FunctionName=name,
        InvocationType='RequestResponse',
        Payload=json.dumps(payload).encode('utf-8')
    )
    body = resp.get('Payload').read()
    try:
        return json.loads(body)
    except Exception:
        return {"statusCode": 500, "body": f"Upstream returned non-JSON: {body!r}"}

def _head_object(bucket, key):
    try:
        s3.head_object(Bucket=bucket, Key=key)
        return True
    except botocore.exceptions.ClientError as e:
        if e.response['ResponseMetadata']['HTTPStatusCode'] == 404:
            return False
        raise

def lambda_handler(event, context):
    # Expected: { franchiseID, templateKey? , requestId? }
    franchise_id = (event.get('franchiseID') or '').strip()
    request_id = event.get('requestId') or (getattr(context, 'aws_request_id', None))

    if not franchise_id:
        return {"statusCode": 400, "body": json.dumps({"error": "franchiseID is required"})}

    template_key = event.get('templateKey') or f"members/franchise/{franchise_id}/templates/quote/quote-template.docx"
    if not template_key.endswith('.docx'):
        return {"statusCode": 400, "body": json.dumps({"error": "Template must be a .docx file", "template_key": template_key})}

    if not _head_object(TEMPLATE_BUCKET, template_key):
        return {"statusCode": 404, "body": json.dumps({"error": "Template not found", "bucket": TEMPLATE_BUCKET, "key": template_key})}

    # Where to write the test outputs
    docx_key = f"members/franchise/{franchise_id}/templates/quote/quote-template-test.docx"
    pdf_key  = f"members/franchise/{franchise_id}/templates/quote/quote-template-test.pdf"

    # Minimal placeholders/blocks; your fill lambda can ignore extras or validate as needed
    placeholders = {
        "CustomerName": "Test Customer",
        "QuoteDate": "2024-01-01",
        "QuoteId": "TEST-QUOTE-1234",
        "TotalPrice": "123.45"
    }
    blocks = []  # add sample repeating blocks here if your template needs them

    # 1) Fill the DOCX
    fill_payload = {
        "template_bucket": TEMPLATE_BUCKET,
        "template_key": template_key,
        "output_bucket": OUTPUT_BUCKET,
        "docx_key": docx_key,
        "placeholders": placeholders,
        "blocks": blocks,
        "requestId": request_id
    }
    fill_res = _invoke_lambda(FILL_LAMBDA, fill_payload)
    if int(fill_res.get("statusCode", 500)) >= 300:
        # Bubble up a helpful error
        return {"statusCode": 422, "body": json.dumps({"error": "Template fill failed", "details": fill_res})}

    # 2) Convert to PDF
    convert_payload = {
        "bucket": OUTPUT_BUCKET,
        "docx_key": docx_key,
        "pdf_key": pdf_key,
        "requestId": request_id
    }
    conv_res = _invoke_lambda(CONVERT_LAMBDA, convert_payload)
    if int(conv_res.get("statusCode", 500)) >= 300:
        return {"statusCode": 422, "body": json.dumps({"error": "PDF conversion failed", "details": conv_res})}

    # Final response
    body = {
        "message": "Template validated and test PDF generated",
        "template_bucket": TEMPLATE_BUCKET,
        "template_key": template_key,
        "output_bucket": OUTPUT_BUCKET,
        "docx_key": docx_key,
        "pdf_key": pdf_key
    }
    return {"statusCode": 200, "body": json.dumps(body)}
