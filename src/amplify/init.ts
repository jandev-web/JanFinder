// src/amplify/init.ts
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json'; // <-- two levels up to project root

let configured = false;
export function initAmplify() {
  if (configured) return;
  Amplify.configure(outputs, { ssr: true });
  configured = true;
}
