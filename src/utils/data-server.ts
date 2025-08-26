// src/utils/data-server.ts
import { type Schema } from '@/../amplify/data/resource';
import outputs from '@/../amplify_outputs.json';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';

// We accept a cookies function from the caller (server code will pass next/headers cookies)
type CookiesFn = () => any;

export function createServerDataClient(cookiesFn: CookiesFn) {
  return generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies: cookiesFn,
  });
}