// amplify/functions/delete-cbo/handler.ts
import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const s3 = new S3Client({});
const cognito = new CognitoIdentityProviderClient({});

// ---- ENV (set in backend.ts) ----
const USER_POOL_ID     = process.env.USER_POOL_ID!;                     // required
const CBO_TABLE        = process.env.CBO_TABLE        ?? "CBO_DB";
const CBO_PK           = process.env.CBO_PK           ?? "CBOID";       // PK attribute name
const S3_BUCKET        = process.env.CBO_PIC_BUCKET   ?? "cbo-pic-storage";
const DEFAULT_KEY      = process.env.DEFAULT_PROFILE_KEY ?? "defaultProfilePic.jpg";

// Derived URL for default image (virtual-hosted style)
const DEFAULT_PROFILE_PIC_URL = `https://${S3_BUCKET}.s3.amazonaws.com/${DEFAULT_KEY}`;

type EventBody = { cboID?: string };
type HandlerEvent = {
  body?: string | EventBody;     // API Gateway-style
  arguments?: EventBody;         // AppSync-style
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
};

function getBody(event: HandlerEvent): EventBody {
  if (event?.arguments) return event.arguments;
  const raw = event?.body;
  if (!raw) return {};
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

function extractS3Key(urlOrKey: string): string {
  if (!urlOrKey) return "";
  const vhostPrefix = `https://${S3_BUCKET}.s3.amazonaws.com/`;
  if (urlOrKey.startsWith(vhostPrefix)) return urlOrKey.slice(vhostPrefix.length);
  try {
    const u = new URL(urlOrKey);
    if (u.hostname.endsWith("amazonaws.com")) {
      const parts = u.pathname.replace(/^\/+/, "").split("/");
      if (parts[0] === S3_BUCKET) return parts.slice(1).join("/");
      return parts.join("/");
    }
  } catch {
    // not a URL — treat as key
  }
  return urlOrKey;
}

export const handler = async (event: HandlerEvent) => {
  try {
    console.log("Received event:", JSON.stringify(event));
    const body = getBody(event);
    const cboID = body?.cboID?.trim();

    if (!cboID) {
      console.log("Missing cboID in request.");
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify("cboID is required.") };
    }

    // 1) Fetch CBO record
    console.log(`Get ${CBO_PK}=${cboID} from ${CBO_TABLE}`);
    const getResp = await ddb.send(new GetCommand({
      TableName: CBO_TABLE,
      Key: { [CBO_PK]: cboID },
    }));

    if (!getResp.Item) {
      console.log(`No item found for ${CBO_PK}: ${cboID}`);
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify("CBO not found.") };
    }

    const cbo = getResp.Item as Record<string, any>;
    const email = cbo.email as string | undefined;
    const profilePicUrl = (cbo.profilePic as string | undefined) ?? DEFAULT_PROFILE_PIC_URL;
    console.log("Current profilePic:", profilePicUrl);

    // 2) Delete S3 profile pic if not default
    if (profilePicUrl !== DEFAULT_PROFILE_PIC_URL) {
      const imageKey = extractS3Key(profilePicUrl);
      if (imageKey) {
        try {
          console.log(`Deleting s3://${S3_BUCKET}/${imageKey}`);
          await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: imageKey }));
          console.log("Profile picture deleted.");
        } catch (e) {
          console.warn("Failed to delete profile picture:", e);
          // non-fatal
        }
      }
    }

    // 3) Delete Cognito user by email (if present)
    if (!USER_POOL_ID) throw new Error("USER_POOL_ID env var is required");
    if (email) {
      console.log(`AdminDeleteUser ${email} in ${USER_POOL_ID}`);
      try {
        await cognito.send(new AdminDeleteUserCommand({ UserPoolId: USER_POOL_ID, Username: email }));
      } catch (err: any) {
        const name = err?.name || err?.__type || "";
        if (name.includes("UserNotFoundException")) {
          console.warn("Cognito user not found; proceed with DB delete.");
        } else {
          console.warn("Cognito AdminDeleteUser error:", err);
        }
      }
    } else {
      console.log(`No email on CBO ${cboID}; skipping Cognito delete.`);
    }

    // 4) Delete CBO record
    console.log(`Delete ${CBO_PK}=${cboID} from ${CBO_TABLE}`);
    await ddb.send(new DeleteCommand({
      TableName: CBO_TABLE,
      Key: { [CBO_PK]: cboID },
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CBO deleted successfully" }),
    };
  } catch (e: any) {
    console.error("Error during deletion:", e);
    const msg = typeof e?.message === "string" ? e.message : String(e);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify(`Error deleting CBO: ${msg}`) };
  }
};

export default handler;
