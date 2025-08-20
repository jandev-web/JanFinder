// src/utils/debug-identity.ts
import { fetchAuthSession } from 'aws-amplify/auth';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import outputs from '../../amplify_outputs.json';

export async function debugIdentity() {
  console.log('[Config check]', {
  graphqlUrl: outputs.data?.url,
  region: outputs.auth?.aws_region,
});
  const s = await fetchAuthSession({ forceRefresh: true });
  console.log('[AuthSession]', {
    identityId: s.identityId,
    hasCreds: !!s.credentials,
    hasUserPoolTokens: !!s.tokens,
    accessKeyIdTail: s.credentials?.accessKeyId?.slice(-4),
    region: outputs.auth?.aws_region,
    apiUrl: outputs.data?.url,
  });

  if (s.credentials) {
    const sts = new STSClient({
      region: outputs.auth?.aws_region,
      credentials: s.credentials,
    });
    const who = await sts.send(new GetCallerIdentityCommand({}));
    console.log('[STS GetCallerIdentity]', {
      account: who.Account,
      arn: who.Arn, // will show assumed-role/.../CognitoIdentity
      userId: who.UserId,
    });
  }
}
