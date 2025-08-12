import type { PreSignUpTriggerHandler } from "aws-lambda";
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { env } from "$amplify/env/pre-sign-up";

const ddb = new DynamoDBClient({});

export const handler: PreSignUpTriggerHandler = async (event) => {
  // Only handle public sign-up path
  if (event.triggerSource !== "PreSignUp_SignUp") return event;

  const role = event.request.clientMetadata?.role;               // "Owner" | "Member"
  const inviteCode = event.request.clientMetadata?.inviteCode;   // required for Member

  if (!role || !["Owner", "Member"].includes(role)) {
    throw new Error("Role is required.");
  }

  if (role === "Member") {
    if (!inviteCode) throw new Error("Invite code required for members.");

    const res = await ddb.send(new GetItemCommand({
      TableName: env.INVITES_TABLE,
      Key: { code: { S: inviteCode } },
      ConsistentRead: true,
    }));

    const item = res.Item;
    if (!item) throw new Error("Invalid invite code.");

    const inviteRole = item.role?.S;
    const franchiseId = item.franchiseId?.S;
    const expiresAt = item.expiresAt?.S;
    const maxUses = Number(item.maxUses?.N ?? "1");
    const usedCount = Number(item.usedCount?.N ?? "0");

    if (inviteRole !== "Member") throw new Error("Invite not valid for Member role.");
    if (!franchiseId) throw new Error("Invite missing franchiseId.");
    if (expiresAt && new Date(expiresAt) < new Date()) throw new Error("Invite expired.");
    if (usedCount >= maxUses) throw new Error("Invite already used.");

    // Stamp attributes on the user being created
    event.request.userAttributes["custom:role"] = "Member";
    event.request.userAttributes["custom:franchiseId"] = franchiseId;

    // Soft-increment usage to reduce races
    await ddb.send(new UpdateItemCommand({
      TableName: env.INVITES_TABLE,
      Key: { code: { S: inviteCode } },
      UpdateExpression: "ADD usedCount :one",
      ExpressionAttributeValues: { ":one": { N: "1" } },
    }));
  } else {
    // Owner path: no invite required
    event.request.userAttributes["custom:role"] = "Owner";
  }

  return event;
};
