import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

declare global {
  // eslint-disable-next-line no-var
  var __amplifyServerConfigured: boolean | undefined;
}

export function initAmplifyServer() {
  if (!global.__amplifyServerConfigured) {
    Amplify.configure(outputs, { ssr: true });
    global.__amplifyServerConfigured = true;
  }
}
