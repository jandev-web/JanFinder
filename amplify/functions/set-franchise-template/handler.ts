// functions/set-franchise-template/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient());

// Use env or default (your table exists outside Amplify)
const FRANCHISE_TABLE = process.env.FRANCHISE_TABLE || 'Franchise_DB';

// ✅ AppSync/Amplify Data resolver handler
export const handler: Schema['setFranchiseTemplate']['functionHandler'] = async (event) => {
  const franchiseID = String(event.arguments?.franchiseID ?? '');
  const templateType = String(event.arguments?.templateType ?? '').toLowerCase();
  const isThere = Boolean(event.arguments?.isThere);

  if (!franchiseID) throw new Error('franchiseID is required');
  if (!['quote', 'contract'].includes(templateType)) {
    throw new Error("templateType must be 'quote' or 'contract'");
  }

  const fieldName = templateType === 'quote' ? 'quoteTemplate' : 'contractTemplate';

  // Table key shape uses your console-created table:
  //   PK: FranchiseID (string)
  const cmd = new UpdateCommand({
    TableName: FRANCHISE_TABLE,
    Key: { FranchiseID: franchiseID },
    UpdateExpression: 'SET #f = :v',
    ExpressionAttributeNames: { '#f': fieldName },
    ExpressionAttributeValues: { ':v': isThere },
    ReturnValues: 'ALL_NEW',
  });

  const resp = await ddbDoc.send(cmd);
  const updated = resp.Attributes ?? {};

  return {
    ok: true,
    franchiseID,
    quoteTemplate: Boolean(updated.quoteTemplate),
    contractTemplate: Boolean(updated.contractTemplate),
  };
};
