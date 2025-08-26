// src/amplify/init.client.ts
'use client';

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

declare global { interface Window { __amplifyConfigured?: boolean } }

export function initAmplifyClient() {
  // ⬇️ Ensure this never runs on the server
  if (typeof window === 'undefined') return;

  if (!window.__amplifyConfigured) {
    Amplify.configure(outputs, { ssr: true });
    window.__amplifyConfigured = true;
  }
}
