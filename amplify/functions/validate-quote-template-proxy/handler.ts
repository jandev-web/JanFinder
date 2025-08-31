import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const client = new LambdaClient({});

export const handler = async (event: any) => {
  const FunctionName = process.env.TARGET_FUNCTION_NAME;
  if (!FunctionName) throw new Error('Missing TARGET_FUNCTION_NAME');

  const payload = new TextEncoder().encode(JSON.stringify(event));
  const out = await client.send(new InvokeCommand({ FunctionName, Payload: payload }));

  // Normalize the Python Lambda’s response back to JSON
  const raw = out.Payload ? new TextDecoder().decode(out.Payload) : '';
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return { statusCode: 200, body: raw };
  }
};