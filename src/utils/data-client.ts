// src/utils/data-client.ts
'use client';

import { initAmplify } from '../amplify/init';
initAmplify();

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

export const dataClient = generateClient<Schema>({
  // You can omit this if your default is IAM; explicit is fine:
  authMode: 'identityPool',
});