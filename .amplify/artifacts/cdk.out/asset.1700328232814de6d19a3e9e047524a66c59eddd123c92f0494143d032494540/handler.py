#functions/update-quote-document-links/handler.py
import os, json, boto3

dynamodb = boto3.resource('dynamodb')
CUSTOMER_QUOTES_TABLE = os.environ.get('CUSTOMER_QUOTES_TABLE','CustomerQuotes')

def lambda_handler(event, context):
    rid = event.get('requestId') or getattr(context,'aws_request_id','no-context')
    quote_id = event.get('quoteID')
    bucket = event.get('bucket')
    pdf_key = event.get('pdf_key')
    if not (quote_id and bucket and pdf_key):
        return {"statusCode":400, "body": json.dumps({"message":"Missing quoteID/bucket/pdf_key"}), "requestId": rid}
    pdf_url = f"https://{bucket}.s3.amazonaws.com/{pdf_key}"

    tbl = dynamodb.Table(CUSTOMER_QUOTES_TABLE)
    tbl.update_item(
        Key={'QuoteID': quote_id},
        UpdateExpression="SET QuotePDF = :u",
        ExpressionAttributeValues={':u': pdf_url}
    )
    return {"statusCode":200, "body": json.dumps({"pdf_url": pdf_url}), "requestId": rid}
