// amplify/functions/get-owner/handler.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
    marshallOptions: { removeUndefinedValues: true },
});

const TABLE = process.env.OWNER_TABLE_NAME || 'Owner_DB';
const PK_NAME = process.env.OWNER_PK_NAME || 'OwnerID'; // default to OwnerID

export const handler: Schema['getOwnerById']['functionHandler'] = async (event) => {
    const ownerId = event.arguments?.id as string | undefined;
    if (!ownerId) {
        return {
            errors: [{ message: "Missing argument 'id'." }],
            data: null,
        };
    }

    try {
        
        const resp = await ddbDoc.send(new GetCommand({
            TableName: TABLE,
            Key: { [PK_NAME]: ownerId },
        }));
        const item = resp.Item ?? null;


        return { data: item };
    } catch (err: any) {
        console.error('get-owner error:', err);
        return {
            errors: [{ message: String(err?.message || err) }],
            data: null,
        };
    }
};
