// src/app/members/sign-up/cbo/invite/page.tsx
import 'server-only';
import React from 'react';
import CBOJoinForm from '@/components/pages/CBOJoinForm';
import { cookies } from 'next/headers';
import { createServerDataClient } from '@/utils/data-server';

export type ActionState = { ok: boolean; error: string | null };
export const dynamic = 'force-dynamic';

type SP = { token?: string | string[] };

const decodeEmailFromToken = (token: string): string | null => {
  const part = token.split('.')[0];
  if (!part) return null;
  try {
    const json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const obj = JSON.parse(json) as { email?: string };
    return obj?.email ?? null; // just for UI; not trusted
  } catch { return null; }
};

export default async function CBOJoinPage({ searchParams }: { searchParams?: Promise<SP> }) {
  const sp = await searchParams;
  const raw = sp?.token;
  const token = Array.isArray(raw) ? raw[0] : raw ?? '';

  // server action that will call cboCompleteSignup with the token
  async function completeSignup(
    signedToken: string,
    _prev: ActionState,
    formData: FormData
  ): Promise<ActionState> {
    'use server';
    const client = createServerDataClient(cookies);

    const firstName = (formData.get('firstName') ?? '').toString().trim();
    const lastName = (formData.get('lastName') ?? '').toString().trim();
    const phone = (formData.get('phone') ?? '').toString().trim();
    const street = (formData.get('street') ?? '').toString().trim();
    const city = (formData.get('city') ?? '').toString().trim();
    const state = (formData.get('state') ?? '').toString().trim();
    const postalCode = (formData.get('postalCode') ?? '').toString().trim();
    const country = (formData.get('country') ?? '').toString().trim();

    if (!firstName || !lastName) return { ok: false, error: 'First and last name are required.' };

    const { errors } = await client.mutations.cboCompleteSignup(
      { token: signedToken, firstName, lastName, phone, street, city, state, postalCode, country },
      { authMode: 'userPool' }
    );

    if (errors?.length) return { ok: false, error: errors[0].message ?? 'Failed to complete signup.' };
    return { ok: true, error: null };
  }

  const boundComplete = completeSignup.bind(null, token) as (prev: ActionState, formData: FormData) => Promise<ActionState>;
  const emailForUI = token ? decodeEmailFromToken(token) : '';
  const tokenMissing = !token;
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
          <div className="border-b px-6 py-5">
            <h1 className="text-2xl font-semibold tracking-tight">Create Your Account</h1>
            <p className="mt-1 text-sm text-gray-600">Sign up to join this franchise.</p>
          </div>
          {tokenMissing ? (
            <div className="px-6 py-6 text-sm text-red-700 bg-red-50 border-t border-red-200">
              This invite link is missing or invalid. Please ask the franchise owner to resend your invite.
            </div>
          ) : (
            <CBOJoinForm
              email={emailForUI ?? ''}
              token={token}
              finishAction={boundComplete}
            />
          )}
        </div>
      </div>
    </div>
  );

}
