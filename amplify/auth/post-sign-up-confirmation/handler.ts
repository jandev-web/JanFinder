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

  // Add user to the matching group
  if (role === 'Owner' || role === 'Member') {
    await cognito.send(
      new AdminAddUserToGroupCommand({
        GroupName: role,
        Username: username,
        UserPoolId: userPoolId,
      })
    );
  }

  // Create Owner & Franchise domain records on Owner signup (unchanged)
  if (role === 'Owner' && sub) {
    const now = new Date().toISOString();

    await ddbDoc.send(
      new PutCommand({
        TableName: env.OWNER_TABLE,
        Item: {
          OwnerID: sub,
          email,
          firstName: given,
          lastName: family,
          phone,
          FranchiseID: franchiseId,
          address: { street: '', city: '', state: '', postalCode: '', country: '' },
          firstSignIn: false,
          createdOn: now,
        },
        ConditionExpression: 'attribute_not_exists(OwnerID)',
      })
    );

    const franchiseAccountNumber = uuidv4();
    await ddbDoc.send(
      new PutCommand({
        TableName: env.FRANCHISE_TABLE,
        Item: {
          FranchiseID: franchiseId,
          OwnerID: sub,
          franchiseName: '',
          franchiseAddress: { street: '', city: '', state: '', postalCode: '', country: '' },
          franchisePhone: '',
          franchiseEmail: '',
          franchiseWebsite: '',
          franchiseDescription: '',
          franchiseAccountNumber,
          franchiseLogo: false,
          franchiseStatus: 'Pending',
          serviceRegions: null,
          contractTemplate: false,
          quoteTemplate: false,
          createdOn: now,
        },
        ConditionExpression: 'attribute_not_exists(FranchiseID)',
      })
    );
  }
  
  // For Members, domain record is created later by your cboCompleteSignup lambda.
  return event;
};
