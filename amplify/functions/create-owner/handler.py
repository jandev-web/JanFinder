import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime

dynamodb = boto3.resource('dynamodb')

S3_BUCKET = 'cbo-pic-storage'

USER_POOL_ID = 'us-east-1_yHmaGJjL5'
TABLE_NAME = 'Owner_DB'

def lambda_handler(event, context):
    try:
        timestamp = datetime.utcnow().isoformat() + 'Z'

        # Extract data from the event body
        body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        print(f"Received body: {body}")
        
        email = ownerData.get('email')
        cognito_user_id = ownerData.get('userID')
        firstName = ownerData.get('firstName')
        lastName = ownerData.get('lastName')
        
        phone = ownerData.get('phone')
        
        

        # Validate input
        if not email or not lastName or not firstName or not phone:
            error_message = 'Email, first name, last name, and phone are required.'
            print(password)
            print(f"Validation Error: {error_message}")
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
                'body': json.dumps({'error': error_message})
            }
        try:
            # Add the CBO details to DynamoDB with Cognito UserSub as franchiseID
            image_url = f"https://{S3_BUCKET}.s3.amazonaws.com/defaultProfilePic.jpg"
            table = dynamodb.Table(TABLE_NAME)
            table.put_item(
                Item={
                    'OwnerID': cognito_user_id,  # Use Cognito UserSub as the franchiseID
                    'franchiseID': None,
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
            )
            print(f"Owner data inserted into DynamoDB")

        except ClientError as e:
            error_message = f"DynamoDB Error: {str(e)}"
            print(error_message)
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                'body': json.dumps({'error': error_message})
            }

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
             'body': json.dumps({'message': 'CBO account created successfully', 'ownerID': cognito_user_id})
        }


    except Exception as e:
        error_message = f"General Error: {str(e)}"
        print(error_message)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': error_message})
        }

