import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const sfn = new SFNClient({});

export const handler = async (event: any) => {
  try {
    const args = event?.arguments ?? {};
    console.log('member-accept-sell-request args:', args);
  
    const requestID = (args.requestID ?? '').trim();
    console.log('requestID:', requestID);
    const memberCBOID = (args.memberCBOID ?? '').trim();
    const timezone = (args.timezone ?? 'America/New_York');

    if (!requestID || !memberCBOID) {
      throw new Error('Missing requestID or memberCBOID');
    }

    const input = JSON.stringify({
      requestID,
      memberCBOID,
      timezone,
    });

    const stateMachineArn = process.env.STATE_MACHINE_ARN!;
    await sfn.send(new StartExecutionCommand({
      stateMachineArn,
      input,
    }));

    return { ok: true };
  } catch (e: any) {
    console.error('member-accept-sell-request error:', e);
    return { ok: false, error: e?.message ?? 'Unknown error' };
  }
};
