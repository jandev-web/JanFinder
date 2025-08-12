import boto3
import json
import traceback
from botocore.exceptions import ClientError
from datetime import datetime
from decimal import Decimal

# Initialize Cognito, DynamoDB, and S3 clients

dynamodb = boto3.resource('dynamodb')
S3_BUCKET        = os.environ['S3_BUCKET']
USER_POOL_ID     = os.environ['USER_POOL_ID']          # injected from backend.ts
CBO_TABLE_NAME   = os.environ['CBO_TABLE_NAME']
OWNER_TABLE_NAME = os.environ['OWNER_TABLE_NAME']

# Custom function to handle Decimal objects in json.dumps()
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

def lambda_handler(event, context):
    print("--------- Lambda Start ---------")
    try:
        print("Received event:", json.dumps(event, default=decimal_default))
    except Exception as e:
        print("Error dumping event:", e)

    # Parse the request body
    try:
        print("[Input] Parsing request body...")
        body = event.get("body")
        print("[Input] Raw body:", body)
        if not body:
            raise ValueError("Missing request body")
        if isinstance(body, str):
            body = json.loads(body)
        print("[Input] Parsed body:", json.dumps(body, default=decimal_default))
        
        # Extract fields from cboData
        cboData = body.get('cboData')
        if not cboData:
            raise ValueError("Missing 'cboData' in request body")
        print("[Input] cboData:", json.dumps(cboData, default=decimal_default))
        
        email = cboData.get('email')
        phone = cboData.get('phone')
        password = 'Password1!'
        firstName = cboData.get('firstName')
        lastName = cboData.get('lastName')
        ownerID = cboData.get('ownerID')
        address = cboData.get('address')
        timestamp = datetime.utcnow().isoformat() + 'Z'

        print("[Input] Extracted fields:")
        print("  Email:", email)
        print("  Phone:", phone)
        print("  Password:", password)
        print("  First Name:", firstName)
        print("  Last Name:", lastName)
        print("  Owner ID:", ownerID)
        print("  Address:", address)
        print("  Timestamp:", timestamp)
        
        if not email or not lastName or not firstName or not ownerID:
            error_message = 'Email, first name, last name, and owner ID are required.'
            print("[Validation Error]", error_message)
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
                'body': json.dumps({'error': error_message})
            }
    except Exception as e:
        error_msg = f"[Input Error] {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            'body': json.dumps({'error': error_msg})
        }
    
    # Query Owner_DB to get the franchiseID
    try:
        print("[Owner Lookup] Querying Owner_DB for OwnerID:", ownerID)
        owner_table = dynamodb.Table(OWNER_TABLE_NAME)
        owner_response = owner_table.get_item(Key={'OwnerID': ownerID})
        print("[Owner Lookup] DynamoDB response:", json.dumps(owner_response, default=decimal_default))
        if 'Item' not in owner_response:
            error_msg = "Owner not found"
            print("[Owner Lookup Error]", error_msg)
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                'body': json.dumps({'error': error_msg})
            }
        owner_data = owner_response['Item']
        franchiseID = owner_data.get('franchiseID')
        if not franchiseID:
            error_msg = "Franchise ID not found for the owner"
            print("[Owner Lookup Error]", error_msg)
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                'body': json.dumps({'error': error_msg})
            }
        print("[Owner Lookup] Franchise ID retrieved:", franchiseID)
    except ClientError as e:
        error_msg = f"[Owner Lookup DynamoDB Error] {e.response['Error']['Message']}\n{traceback.format_exc()}"
        print(error_msg)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': error_msg})
        }
    except Exception as e:
        error_msg = f"[Owner Lookup Error] {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': error_msg})
        }
    
    # Create a new user in Cognito
    try:
        print("[Cognito] Creating user in Cognito User Pool for email:", email)
        response = cognito_client.admin_create_user(
            UserPoolId=USER_POOL_ID,
            Username=email,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
            ],
            TemporaryPassword=password,
            ForceAliasCreation=True,
        )
        print("[Cognito] Create user response:", json.dumps(response, default=decimal_default))
        cognito_user_id = response['User']['Username']
        print("[Cognito] Cognito UserSub (Username):", cognito_user_id)
        
        print("[Cognito] Setting temporary password for user...")
        cognito_client.admin_set_user_password(
            UserPoolId=USER_POOL_ID,
            Username=email,
            Password=password,
            Permanent=False
        )
        print("[Cognito] Password set for user:", cognito_user_id)
    except ClientError as e:
        error_msg = f"[Cognito Error] {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': error_msg})
        }
    except Exception as e:
        error_msg = f"[Cognito General Error] {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': error_msg})
        }
    
    # Insert CBO details into DynamoDB (CBO_DB)
    try:
        print("[DynamoDB] Inserting CBO data into table:", CBO_TABLE_NAME)
        image_url = f"https://{S3_BUCKET}.s3.amazonaws.com/defaultProfilePic.jpg"
        
        cbo_table = dynamodb.Table(CBO_TABLE_NAME)
        cbo_item = {
            'CBOID': cognito_user_id,
            'franchiseID': franchiseID,
            'email': email,
            'firstName': firstName,
            'lastName': lastName,
            'address': address,
            'phone': phone,
            'profilePic': image_url,
            'subscription': {
                'subName': 'None',
                'subLevel': 'None',
                'subType': 'None',
                'subCost': 0,
                'subServices': [],
                'has': False,
                'startData': 'None',
                'frequency': 'None',
                'nextChargeDate': 'None',
                'type': 'None',
            },
            'createdOn': timestamp
        }
        print("[DynamoDB] CBO item to be inserted:", json.dumps(cbo_item, default=decimal_default))
        cbo_table.put_item(Item=cbo_item)
        print("[DynamoDB] Successfully inserted CBO data for CBOID:", cognito_user_id)
    except ClientError as e:
        error_msg = f"[DynamoDB Error] {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': error_msg})
        }
    except Exception as e:
        error_msg = f"[DynamoDB General Error] {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': error_msg})
        }

    success_msg = f"CBO account created successfully for {email}. Cognito ID: {cognito_user_id}"
    print("[lambda_handler] Success:", success_msg)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps({'message': success_msg, 'CBOID': cognito_user_id})
    }