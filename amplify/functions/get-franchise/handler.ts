// amplify/functions/get-franchise/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient());

const TABLE = process.env.FRANCHISE_TABLE ?? 'Franchise_DB';
const PK_NAME = process.env.FRANCHISE_PK_NAME ?? 'FranchiseID';

export const handler: Schema['getFranchiseInfo']['functionHandler'] = async (event) => {
  const franchiseID = event.arguments?.franchiseID as string | undefined;
  if (!franchiseID) throw new Error("Missing argument 'franchiseID'.");

  try {
          
          const resp = await ddbDoc.send(new GetCommand({
              TableName: TABLE,
              Key: { [PK_NAME]: franchiseID },
          }));
          const item = resp.Item ?? null;
  
  
          return { data: item };
      } catch (err: any) {
          console.error('get-franchise error:', err);
          return {
              errors: [{ message: String(err?.message || err) }],
              data: null,
          };
      }
  

  
};

export default handler;

