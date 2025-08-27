import os
import json
import boto3
import tempfile
import base64
import time
from botocore.exceptions import ClientError

# Adobe PDF Services SDK
from adobe.pdfservices.operation.auth.service_principal_credentials import ServicePrincipalCredentials
from adobe.pdfservices.operation.pdf_services import PDFServices
from adobe.pdfservices.operation.pdf_services_media_type import PDFServicesMediaType
from adobe.pdfservices.operation.pdfjobs.jobs.create_pdf_job import CreatePDFJob
from adobe.pdfservices.operation.pdfjobs.result.create_pdf_result import CreatePDFResult

s3 = boto3.client('s3')

def get_secret(secret_name: str, region_name: str = "us-east-1") -> str:
    sm = boto3.client('secretsmanager', region_name=region_name)
    resp = sm.get_secret_value(SecretId=secret_name)
    if 'SecretString' in resp:
        return resp['SecretString']
    return base64.b64decode(resp['SecretBinary']).decode('utf-8')

def convert_docx_to_pdf_with_adobe(docx_bytes: bytes) -> bytes:
    # persist docx to tmp
    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as f:
        f.write(docx_bytes)
        docx_path = f.name

    try:
        # creds from Secrets Manager
        secret_name = os.environ.get("ADOBE_SECRET_NAME", "adobe-credentials")
        creds_raw = json.loads(get_secret(secret_name))
        client_id = creds_raw["client_credentials"]["client_id"]
        client_secret = creds_raw["client_credentials"]["client_secret"]

        creds = ServicePrincipalCredentials(client_id=client_id, client_secret=client_secret)
        pdf_services = PDFServices(credentials=creds)

        with open(docx_path, "rb") as fh:
            input_stream = fh.read()

        # upload with simple retry
        for attempt in range(1, 4):
            try:
                input_asset = pdf_services.upload(input_stream=input_stream, mime_type=PDFServicesMediaType.DOCX)
                break
            except Exception:
                if attempt == 3:
                    raise
                time.sleep(2 * attempt)

        job = CreatePDFJob(input_asset)
        location = pdf_services.submit(job)
        result = pdf_services.get_job_result(location, CreatePDFResult)
        asset = result.get_result().get_asset()
        stream_asset = pdf_services.get_content(asset)
        return stream_asset.get_input_stream()
    finally:
        try:
            os.remove(docx_path)
        except Exception:
            pass

def lambda_handler(event, _context):
    # expects: {"docx_key":"...","pdf_key":"..."}
    try:
        docx_key = event.get("docx_key")
        pdf_key = event.get("pdf_key")
        if not docx_key or not pdf_key:
            return {"statusCode": 400, "body": json.dumps("Missing docx_key or pdf_key")}
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps(f"Invalid event: {e}")}

    bucket = os.environ["CONTRACT_BUCKET"]

    try:
        obj = s3.get_object(Bucket=bucket, Key=docx_key)
        docx_data = obj["Body"].read()
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps(f"S3 get DOCX failed: {e}")}

    try:
        pdf_bytes = convert_docx_to_pdf_with_adobe(docx_data)
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps(f"Conversion failed: {e}")}

    try:
        s3.put_object(Bucket=bucket, Key=pdf_key, Body=pdf_bytes, ContentType="application/pdf")
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps(f"S3 put PDF failed: {e}")}

    return {"statusCode": 200, "body": json.dumps("OK")}
