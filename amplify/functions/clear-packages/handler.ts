// amplify/functions/clear-packages/handler.ts
import { DynamoDB } from 'aws-sdk';

type AppSyncEvent = {
  arguments?: { quoteID?: string };
};

const ddb = new DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const TABLE = process.env.CUSTOMER_QUOTES_TABLE ?? 'CustomerQuotes'; // falls back if env not set

export const handler = async (event: AppSyncEvent) => {
  const quoteID = event?.arguments?.quoteID;
  if (!quoteID) {
    return { error: 'quoteID is required' };
  }

  const pkg = {
    // explicit any types to match your requested shape
    packageOptions: [] as any[],
    packageChoice: null as any | null,
  };

  try {
    const res = await ddb
      .update({
        TableName: TABLE,
        Key: { QuoteID: quoteID }, // adjust if your PK is named differently
        UpdateExpression: 'SET #pkg = :pkg',
        ExpressionAttributeNames: { '#pkg': 'Package' },
        ExpressionAttributeValues: { ':pkg': pkg },
        ConditionExpression: 'attribute_exists(QuoteID)',
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return {
      message: 'Package cleared',
      quoteID,
      package: (res.Attributes as any)?.Package ?? pkg,
    };
  } catch (err: any) {
    if (err?.code === 'ConditionalCheckFailedException') {
      return { error: `Quote not found: ${quoteID}` };
    }
    console.error('clearPackages error:', err);
    return { error: 'Internal error', details: err?.message ?? String(err) };
  }
};
