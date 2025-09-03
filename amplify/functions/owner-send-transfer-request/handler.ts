import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
    marshallOptions: { removeUndefinedValues: true },
});

type Args = {
    quoteID?: string;
    ownerID?: string;     // who is sending
    targetUser?: string;  // CBOID
};

export const handler = async (event: any) => {
    try {
        // Support Amplify Data (event.arguments) and raw REST (event.body)
        const args: Args = event?.arguments
            ? event.arguments
            : typeof event?.body === 'string'
                ? JSON.parse(event.body)
                : event?.body ?? {};

        const { quoteID, ownerID, targetUser } = args || {};
        if (!quoteID || !ownerID || !targetUser) {
            throw new Error('Missing required fields: quoteID, ownerID, targetUser.');
        }

        const SELL_REQUEST_TABLE = process.env.SELL_REQUEST_TABLE!;
        const CUSTOMER_QUOTES_TABLE = process.env.CUSTOMER_QUOTES_TABLE; // optional
        const requestID = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
        const now = new Date().toISOString();

        // 1) Create a Sell/Transfer Request row
        await ddb.send(new PutCommand({
            TableName: SELL_REQUEST_TABLE,
            Item: {
                RequestID: requestID,
                QuoteID: quoteID,
                FromOwnerID: ownerID,
                TargetUser: targetUser,       //CBOID
                Status: 'PENDING',
                CreatedAt: now,
                UpdatedAt: now,
            },
            ConditionExpression: 'attribute_not_exists(RequestID)',
        }));



        await ddb.send(new UpdateCommand({
            TableName: CUSTOMER_QUOTES_TABLE,
            Key: { QuoteID: quoteID },
            UpdateExpression:
                'SET latestRequestID = :rid',
            ExpressionAttributeValues: {
                ':rid': requestID,
            },
        }));


        return { ok: true, requestID };
    } catch (err: any) {
        console.error('send-transfer-request error:', err);
        return {
            ok: false,
            error: err?.message ?? 'Unknown error',
        };
    }
};
