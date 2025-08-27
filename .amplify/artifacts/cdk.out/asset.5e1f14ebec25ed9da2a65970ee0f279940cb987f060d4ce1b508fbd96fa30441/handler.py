import os, json, boto3, tempfile, base64, time, traceback
from botocore.exceptions import ClientError

from adobe.pdfservices.operation.auth.service_principal_credentials import ServicePrincipalCredentials
from adobe.pdfservices.operation.pdf_services import PDFServices
from adobe.pdfservices.operation.pdf_services_media_type import PDFServicesMediaType
from adobe.pdfservices.operation.pdfjobs.jobs.create_pdf_job import CreatePDFJob
from adobe.pdfservices.operation.pdfjobs.result.create_pdf_result import CreatePDFResult

s3 = boto3.client('s3')
sm = boto3.client('secretsmanager')

CONTRACT_BUCKET = os.environ.get("CONTRACT_BUCKET", "janfindbucket1c1b5-dev")
ADOBE_SECRET_NAME = os.environ.get("ADOBE_SECRET_NAME", "adobe-credentials")

def _log(rid, msg, **kv):
    print(f"[convertDocxtoPDF][{rid}] {msg} :: {json.dumps(kv, default=str)}")

def get_secret(secret_name: str, rid: str, region_name: str = "us-east-1") -> str:
    _log(rid, "SecretsManager get", secret_name=secret_name, region=region_name)
    resp = sm.get_secret_value(SecretId=secret_name)
    if 'SecretString' in resp:
        return resp['SecretString']
    return base64.b64decode(resp['SecretBinary']).decode('utf-8')

def convert_docx_to_pdf_with_adobe(docx_bytes: bytes, rid: str) -> bytes:
    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as f:
        f.write(docx_bytes)
        docx_path = f.name
    _log(rid, "DOCX written to tmp", path=docx_path, size=len(docx_bytes))

    try:
        creds_raw = json.loads(get_secret(ADOBE_SECRET_NAME, rid))
        client_id = creds_raw["client_credentials"]["client_id"]
        client_secret = creds_raw["client_credentials"]["client_secret"]
        _log(rid, "Adobe creds loaded", client_id_len=len(client_id), client_secret_len=len(client_secret))

        creds = ServicePrincipalCredentials(client_id=client_id, client_secret=client_secret)
        pdf_services = PDFServices(credentials=creds)

        with open(docx_path, "rb") as fh:
            input_stream = fh.read()

        for attempt in range(1, 4):
            try:
                input_asset = pdf_services.upload(input_stream=input_stream, mime_type=PDFServicesMediaType.DOCX)
                _log(rid, "Asset uploaded", attempt=attempt)
                break
            except Exception as e:
                _log(rid, "Upload failed", attempt=attempt, error=str(e))
                if attempt == 3:
                    raise
                time.sleep(2 * attempt)

        job = CreatePDFJob(input_asset)
        location = pdf_services.submit(job)
        _log(rid, "Job submitted", location=str(location))

        result = pdf_services.get_job_result(location, CreatePDFResult)
        asset = result.get_result().get_asset()
        stream_asset = pdf_services.get_content(asset)
        pdf_bytes = stream_asset.get_input_stream()
        _log(rid, "PDF bytes obtained", size=len(pdf_bytes))

        return pdf_bytes
    finally:
        try:
            os.remove(docx_path)
            _log(rid, "Tmp file removed", path=docx_path)
        except Exception as e:
            _log(rid, "Tmp file remove failed", error=str(e))

def lambda_handler(event, context):
    rid = (event or {}).get("requestId") or getattr(context, "aws_request_id", "no-context")
    _log(rid, "START", event=event, env={"CONTRACT_BUCKET": CONTRACT_BUCKET, "ADOBE_SECRET_NAME": ADOBE_SECRET_NAME})

    try:
        docx_key = event.get("docx_key")
        pdf_key = event.get("pdf_key")
        if not docx_key or not pdf_key:
            _log(rid, "Missing keys", docx_key=docx_key, pdf_key=pdf_key)
            return {"statusCode": 400, "body": json.dumps("Missing docx_key or pdf_key"), "requestId": rid}
    except Exception as e:
        _log(rid, "Invalid event", error=str(e))
        return {"statusCode": 400, "body": json.dumps(f"Invalid event: {e}"), "requestId": rid}

    try:
        _log(rid, "S3 get DOCX", bucket=CONTRACT_BUCKET, key=docx_key)
        obj = s3.get_object(Bucket=CONTRACT_BUCKET, Key=docx_key)
        docx_data = obj["Body"].read()
        _log(rid, "DOCX fetched", size=len(docx_data))
    except Exception as e:
        _log(rid, "S3 get failed", error=str(e), traceback=traceback.format_exc())
        return {"statusCode": 500, "body": json.dumps(f"S3 get DOCX failed: {e}"), "requestId": rid}

    try:
        pdf_bytes = convert_docx_to_pdf_with_adobe(docx_data, rid)
    except Exception as e:
        _log(rid, "Conversion failed", error=str(e), traceback=traceback.format_exc())
        return {"statusCode": 500, "body": json.dumps(f"Conversion failed: {e}"), "requestId": rid}

    try:
        _log(rid, "S3 put PDF", bucket=CONTRACT_BUCKET, key=pdf_key, size=len(pdf_bytes))
        s3.put_object(Bucket=CONTRACT_BUCKET, Key=pdf_key, Body=pdf_bytes, ContentType="application/pdf")
    except Exception as e:
        _log(rid, "S3 put failed", error=str(e), traceback=traceback.format_exc())
        return {"statusCode": 500, "body": json.dumps(f"S3 put PDF failed: {e}"), "requestId": rid}

    _log(rid, "DONE")
    return {"statusCode": 200, "body": json.dumps("OK"), "requestId": rid}
