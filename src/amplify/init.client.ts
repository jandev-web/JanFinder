// src/amplify/init.client.ts
'use client';

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

declare global { interface Window { __amplifyConfigured?: boolean } }

const w: (Window & { __amplifyConfigured?: boolean }) | undefined =
  typeof window === 'undefined' ? undefined : window;

if (w && !w.__amplifyConfigured) {
  Amplify.configure(outputs, { ssr: true });
  w.__amplifyConfigured = true;
}
