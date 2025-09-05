// amplify/functions/add-cbo-franchise/handler.ts
import type { Handler } from 'aws-lambda';
import {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
    AdminSetUserPasswordCommand,
    AdminAddUserToGroupCommand,
    AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';

const USER_POOL_ID = process.env.USER_POOL_ID!;
const CBO_TABLE = process.env.CBO_TABLE || 'CBO_DB';
const MEMBERS_GROUP = process.env.MEMBERS_GROUP || 'Member';

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
    marshallOptions: { removeUndefinedValues: true },
});
const cognito = new CognitoIdentityProviderClient({});

function randomPassword(length = 16) {
    // At least one upper, lower, number, symbol; Cognito default policy often requires this
    const sets = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        '!@#$%^&*()-_=+[]{};:,.<>/?',
    ];
    const all = sets.join('');
    // Guarantee one char from each set
    const base = sets.map(s => s[Math.floor(Math.random() * s.length)]).join('');
    const rest = Array.from(crypto.randomBytes(length - sets.length))
        .map(b => all[b % all.length])
        .join('');
    // Shuffle
    return (base + rest).split('').sort(() => Math.random() - 0.5).join('');
}

type EventArgs = {
    franchiseID: string;
    member: string | {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        address?: any;
    };
};

export const handler: Handler = async (event: any) => {
    try {
        // Support Amplify Data (event.arguments) and optional REST proxy (event.body)
        const args: EventArgs =
            event?.arguments ??
            (event?.body ? JSON.parse(typeof event.body === 'string' ? event.body : '{}') : {});

        const franchiseID = (args as any)?.franchiseID;
        const rawMember = (args as any)?.member;

        // Accept both stringified JSON and object
        const m = typeof rawMember === 'string' ? JSON.parse(rawMember) : rawMember;

        if (!franchiseID || !m?.firstName || !m?.lastName || !m?.email) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields.' }) };
        }

        const email = m.email.trim().toLowerCase();
        const username = email; // Use email as username for simplicity
        const password = randomPassword();

        // 1) Create/ensure Cognito user
        let created = false;
        try {
            await cognito.send(new AdminCreateUserCommand({
                UserPoolId: USER_POOL_ID,
                Username: username,
                MessageAction: 'SUPPRESS', // we set a permanent password below
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'email_verified', Value: 'true' },
                    { Name: 'given_name', Value: m.firstName },
                    { Name: 'family_name', Value: m.lastName },
                    { Name: 'custom:FranchiseID', Value: franchiseID },
                    { Name: 'custom:role', Value: 'Member' },
                ],
            }));
            created = true;
        } catch (err: any) {
            // If the user already exists, continue (we’ll still add group + DDB)
            const code = err?.name || err?.code;
            if (code !== 'UsernameExistsException') throw err;
        }

        // 1b) Set a permanent password (no email invitation flow)
        try {
            await cognito.send(new AdminSetUserPasswordCommand({
                UserPoolId: USER_POOL_ID,
                Username: username,
                Password: password,
                Permanent: true,
            }));
        } catch {
            // If the user already had a password, this will fail; it's ok to ignore.
        }

        // 1c) Ensure email_verified true (idempotent)
        try {
            await cognito.send(new AdminUpdateUserAttributesCommand({
                UserPoolId: USER_POOL_ID,
                Username: username,
                UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
            }));
        } catch {
            /* noop */
        }

        // 1d) Add to members group
        await cognito.send(new AdminAddUserToGroupCommand({
            UserPoolId: USER_POOL_ID,
            Username: username,
            GroupName: MEMBERS_GROUP,
        }));

        // 2) Put CBO record in DynamoDB
        const now = new Date().toISOString();
        const item = {
            // Choose your primary/sort keys as used elsewhere in your project
            CBOID: username,                 // or a ULID/UUID if you prefer
            FranchiseID: franchiseID,
            FirstName: m.firstName,
            LastName: m.lastName,
            Email: email,
            Phone: m.phone || null,
            Address: m.address ?? null,      // store JSON as map
            CreatedOn: now,
            HasProfilePic: false,
            Status: 'ACTIVE',
            Source: created ? 'lambda-create' : 'lambda-upsert',
        };

        await ddbDoc.send(new PutCommand({
            TableName: CBO_TABLE,
            Item: item,
            ConditionExpression: 'attribute_not_exists(CBOID)', // idempotent – avoid overwrite
        })).catch(async (e: any) => {
            // If already exists, ignore the conditional error
            if (e?.name !== 'ConditionalCheckFailedException') throw e;
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                memberID: username,
                tempPassword: password, // return if you want to surface it; otherwise omit
                message: 'CBO created and added to members group.',
            }),
        };
    } catch (err: any) {
        console.error('add-cbo-franchise error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, message: err?.message || 'Internal error' }),
        };
    }
};
