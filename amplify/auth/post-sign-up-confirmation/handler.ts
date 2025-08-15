// amplify/auth/post-sign-up-confirmation/handler.ts
import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { env } from '$amplify/env/post-confirmation';
import { v4 as uuidv4 } from 'uuid';


const cognito = new CognitoIdentityProviderClient({});
const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') return event;
  console.log(process.env.OWNER_TABLE)
  const attrs = event.request.userAttributes || {};
  const role = attrs['custom:role'];        // "Owner" | "Member"
  const sub = attrs['sub'];  
  const franchiseId = attrs['custom:FranchiseID'];          
  const email = attrs['email'] || '';
  const given = attrs['given_name'] || '';
  const family = attrs['family_name'] || '';
  const phone = attrs['phone_number'] || '';
  const username = event.userName;          // cognito:username
  const userPoolId = event.userPoolId;

  // 1) Add user to the matching group (keeps authorization clean)
  if (role === 'Owner' || role === 'Member') {
    await cognito.send(
      new AdminAddUserToGroupCommand({
        GroupName: role,
        Username: username,
        UserPoolId: userPoolId,
      })
    );
  }

  // 2) Create domain records
  if (role === 'Owner' && sub) {
    const now = new Date().toISOString();
    console.log('Creating Owner record for', sub);
    await ddbDoc.send(
      new PutCommand({
        TableName: env.OWNER_TABLE, // e.g., "Owner_DB"
        Item: {
          OwnerID: sub,
          email,
          firstName: given,
          lastName: family,
          phone,
          FranchiseID: franchiseId,
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
          },
          firstSignIn: false, // your flag
          createdOn: now,
        },
        // If the trigger retries, avoid double writes
        ConditionExpression: 'attribute_not_exists(OwnerID)',
      })
    );
    console.log('Created Owner record for', sub);
    console.log('Creating Franchise');
    
    const franchiseAccountNumber = uuidv4()
    await ddbDoc.send(
      new PutCommand({
        TableName: env.FRANCHISE_TABLE, // e.g., "Franchise_DB"
        Item: {
          FranchiseID: franchiseId,
          OwnerID: sub,
          franchiseName: '',
          franchiseAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
          },
          franchisePhone: '',
          franchiseEmail: '',
          franchiseWebsite: '',
          franchiseDescription: '',
          franchiseAccountNumber: franchiseAccountNumber,
          franchiseLogo: false,
          franchiseStatus: 'Pending',
          serviceRegions: null,
          contractTemplate: false,
          quoteTemplate: false,
          createdOn: now,
        },
        // If the trigger retries, avoid double writes
        ConditionExpression: 'attribute_not_exists(FranchiseID)',
      })
    );
  }

  // For Members, you can add your CBO/Member_DB creation later:
  // if (role === 'Member' && sub) { /* put into Member_DB */ }

  return event;
};
