// amplify/functions/delete-franchise-contract-template/handler.ts
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const s3 = new S3Client({});
const ddb = new DynamoDBClient({});

// These are set in backend.ts for your function
const BUCKET = process.env.TEMPLATE_BUCKET ?? process.env.OUTPUT_BUCKET ?? '';
const FRANCHISE_TABLE = process.env.FRANCHISE_TABLE ?? 'Franchise_DB';

export const handler = async (event: any) => {
  const rid =
    event?.requestId ||
    event?.headers?.['x-amzn-requestid'] ||
    (globalThis.crypto?.randomUUID?.() ?? 'no-context');

  const args =
    event?.arguments || event?.body || event;
  const franchiseID =
    args?.franchiseID || args?.FranchiseID;

  if (!franchiseID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing franchiseID' }),
      requestId: rid,
    };
  }

  // S3 keys (public prefix because FileUploader writes to public/)
  const base = `members/franchise/${franchiseID}/templates/contract`;
  const keys = [
    `${base}/contract-template.docx`,
    `${base}/contract-template-test.docx`,
    `${base}/contract-template-test.pdf`,
  ];
  console.log('[delete-template] S3 keys', { rid, franchiseID, keys });

  // Best-effort delete, ignore NotFound
  if (BUCKET) {
    try {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        }),
      );
    } catch (e) {
      console.warn('[delete-template] S3 delete warning', { rid, error: String(e) });
    }
  }

  // ✅ Only update the nested field; do not also update 'data' in the same call
  await ddb.send(
    new UpdateItemCommand({
      TableName: FRANCHISE_TABLE,
      Key: { FranchiseID: { S: franchiseID } },
      UpdateExpression: 'SET #qt = :f',
      ExpressionAttributeNames: { '#qt': 'contractTemplate' },
      ExpressionAttributeValues: { ':f': { BOOL: false } },
      ReturnValues: 'UPDATED_NEW',
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
    requestId: rid,
  };
};
