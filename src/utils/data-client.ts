// src/utils/data-client.ts
'use client';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

if (!(globalThis as any).__amplifyConfigured) {
  Amplify.configure(outputs);
  (globalThis as any).__amplifyConfigured = true;
}

export const dataClient = generateClient<Schema>();
