import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { env } from "$amplify/env/post-confirmation";

const cognito = new CognitoIdentityProviderClient({});
const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") return event;

  const attrs = event.request.userAttributes || {};
  const role = attrs["custom:role"];
  const sub = attrs["sub"];
  const email = attrs["email"];
  const given_name = attrs["given_name"] || "";
  const family_name = attrs["family_name"] || "";
  const phone = attrs["phone_number"] || "";
  const username = event.userName;
  const userPoolId = event.userPoolId;

  // 1) Add to Cognito group
  if (role === "Owner" || role === "Member") {
    await cognito.send(new AdminAddUserToGroupCommand({
      GroupName: role,
      Username: username,       // NOTE: use cognito:username, not sub
      UserPoolId: userPoolId,
    }));
  }

  // 2) If Owner, create Owner_DB record with firstSignIn=false
  if (role === "Owner" && sub) {
    const now = new Date().toISOString();
    await ddbDoc.send(new PutCommand({
      TableName: env.OWNER_TABLE,
      Item: {
        OwnerID: sub,
        email,
        firstName: given_name,
        lastName: family_name,
        phone,
        address: {
          // You may also pass address via clientMetadata at signUp if desired
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        profilePic: `https://${env.S3_BUCKET}.s3.amazonaws.com/defaultProfilePic.jpg`,
        subscription: {
          subName: "None",
          subLevel: "None",
          subType: "None",
          subCost: 0,
          subServices: [],
          has: false,
          startData: "None",
          frequency: "None",
          nextChargeDate: "None",
          type: "None",
        },
        firstSignIn: false,   // <-- your flag
        createdOn: now,
      },
      // Idempotency protection if trigger retries:
      ConditionExpression: "attribute_not_exists(OwnerID)",
    }));
  }

  return event;
};
