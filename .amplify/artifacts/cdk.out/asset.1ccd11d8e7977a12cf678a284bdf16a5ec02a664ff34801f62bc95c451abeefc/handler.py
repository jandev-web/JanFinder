#convert-docx-to-pdf handler.py
import os, json, boto3, tempfile, base64, time, traceback

from adobe.pdfservices.operation.auth.service_principal_credentials import ServicePrincipalCredentials
from adobe.pdfservices.operation.pdf_services import PDFServices
from adobe.pdfservices.operation.pdf_services_media_type import PDFServicesMediaType
from adobe.pdfservices.operation.pdfjobs.jobs.create_pdf_job import CreatePDFJob
from adobe.pdfservices.operation.pdfjobs.result.create_pdf_result import CreatePDFResult

s3 = boto3.client('s3')
sm = boto3.client('secretsmanager')

# Accept CONTRACT_BUCKET (legacy) or OUTPUT_BUCKET
DEFAULT_BUCKET = os.environ.get("CONTRACT_BUCKET") or os.environ.get("OUTPUT_BUCKET") or ""
ADOBE_SECRET_NAME = os.environ.get("ADOBE_SECRET_NAME","adobe-credentials")

def _log(rid,msg,**kv): print(f"[convertDocxtoPDF][{rid}] {msg} :: {json.dumps(kv, default=str)}")

def get_secret(name, rid):
    _log(rid,"SecretsManager get", secret=name)
    resp = sm.get_secret_value(SecretId=name)
    if 'SecretString' in resp: return resp['SecretString']
    return base64.b64decode(resp['SecretBinary']).decode('utf-8')

def convert(docx_bytes, rid):
    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as f:
        f.write(docx_bytes); path=f.name
    try:
        creds_raw=json.loads(get_secret(ADOBE_SECRET_NAME, rid))
        creds=ServicePrincipalCredentials(
            client_id=creds_raw["client_credentials"]["client_id"],
            client_secret=creds_raw["client_credentials"]["client_secret"]
        )
        pdfs=PDFServices(credentials=creds)
        with open(path,"rb") as fh: input_stream=fh.read()
        for attempt in range(1,4):
            try:
                asset = pdfs.upload(input_stream=input_stream, mime_type=PDFServicesMediaType.DOCX)
                break
            except Exception as e:
                if attempt==3: raise
                time.sleep(2*attempt)
        job=CreatePDFJob(asset)
        location=pdfs.submit(job)
        result=pdfs.get_job_result(location, CreatePDFResult)
        stream_asset=pdfs.get_content(result.get_result().get_asset())
        return stream_asset.get_input_stream()
    finally:
        try: os.remove(path)
        except: pass

def lambda_handler(event, context):
    rid=event.get("requestId") or getattr(context,"aws_request_id","no-context")
    bucket = event.get("bucket") or DEFAULT_BUCKET
    docx_key = event.get("docx_key")
    pdf_key  = event.get("pdf_key")
    if not bucket or not docx_key or not pdf_key:
        return {"statusCode":400, "body": json.dumps("Missing bucket/docx_key/pdf_key"), "requestId": rid}

    try:
        obj=s3.get_object(Bucket=bucket, Key=docx_key)
        docx_bytes=obj["Body"].read()
    except Exception as e:
        return {"statusCode":500, "body": json.dumps(f"S3 get DOCX failed: {e}"), "requestId": rid}

    try:
        pdf_bytes=convert(docx_bytes, rid)
    except Exception as e:
        return {"statusCode":500, "body": json.dumps(f"Conversion failed: {e}"), "requestId": rid}

    try:
        s3.put_object(Bucket=bucket, Key=pdf_key, Body=pdf_bytes, ContentType="application/pdf")
    except Exception as e:
        return {"statusCode":500, "body": json.dumps(f"S3 put PDF failed: {e}"), "requestId": rid}

    return {"statusCode":200, "body": json.dumps({"bucket": bucket, "pdf_key": pdf_key}), "requestId": rid}
