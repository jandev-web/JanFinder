// components/pages/CBOJoinForm.tsx
'use client';
import * as React from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import AddCBOAddress from '@/components/AddCBOAddress';

export type ActionState = { ok: boolean; error: string | null };
type FinishAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

type Props = {
  email?: string;
  token: string;
  finishAction: FinishAction;
};

function normalizePhoneToE164(raw: string): string | undefined | null {
  if (!raw) return undefined;
  const s = raw.trim();
  if (!s) return undefined;
  if (s.startsWith('+')) return /^\+\d{7,15}$/.test(s) ? s : null;
  const d = s.replace(/\D/g, '');
  if (!d) return undefined;
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+1${d.slice(1)}`;
  return null;
}

export default function CBOJoinForm({ email = '', token, finishAction }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [step, setStep] = React.useState<'enter' | 'verify'>('enter');
  const [error, setError] = React.useState<string | null>(null);

  const [emailInput, setEmailInput] = React.useState(email);
  const emailReadOnly = Boolean(email);

  const [address, setAddress] = React.useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const onAddressChange = (k: string, v: string) => setAddress((p) => ({ ...p, [k]: v }));

  const [finishState, finish] = React.useActionState<ActionState, FormData>(finishAction, {
    ok: false,
    error: null,
  });

  React.useEffect(() => {
    if (finishState.ok) router.replace('/business/cbo?joined=1');
  }, [finishState.ok, router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError('Missing token.');
      return;
    }

    const em = emailReadOnly ? email : emailInput;
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(em)) {
      setError('Please enter a valid email.');
      return;
    }

    const phoneE164 = normalizePhoneToE164(phone);
    if (phone && phoneE164 === null) {
      setError('Invalid phone number format. Use +E.164 (e.g., +15551234567) or a 10/11-digit US number.');
      return;
    }

    try {
      const res = await signUp({
        username: em,
        password,
        options: {
          userAttributes: {
            email: em,
            given_name: firstName,
            family_name: lastName,
            phone_number: phoneE164 || undefined,
          },
          clientMetadata: { token },
        },
      });

      const next = res?.nextStep?.signUpStep;
      if (next === 'CONFIRM_SIGN_UP') {
        setStep('verify');
        return;
      }

      // Auto-confirmed (no code): sign in & run server action in a transition
      await signIn({ username: em, password });

      const fd = new FormData();
      fd.set('firstName', firstName);
      fd.set('lastName', lastName);
      if (phoneE164) fd.set('phone', phoneE164);
      fd.set('street', address.street);
      fd.set('city', address.city);
      fd.set('state', address.state);
      fd.set('postalCode', address.postalCode);
      fd.set('country', address.country);

      React.startTransition(() => {
        // Do NOT await – let useActionState manage pending and errors
        finish(fd);
      });
    } catch (err: any) {
      setError(err?.message ?? 'Sign up failed.');
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const em = emailReadOnly ? email : emailInput;
    const phoneE164 = normalizePhoneToE164(phone);
    if (phone && phoneE164 === null) {
      setError('Invalid phone number format. Use +E.164 (e.g., +15551234567) or a 10/11-digit US number.');
      return;
    }

    try {
      await confirmSignUp({ username: em, confirmationCode: code });
      await signIn({ username: em, password });

      const fd = new FormData();
      fd.set('firstName', firstName);
      fd.set('lastName', lastName);
      if (phoneE164) fd.set('phone', phoneE164);
      fd.set('street', address.street);
      fd.set('city', address.city);
      fd.set('state', address.state);
      fd.set('postalCode', address.postalCode);
      fd.set('country', address.country);

      React.startTransition(() => {
        finish(fd);
      });
    } catch (err: any) {
      setError(err?.message ?? 'Verification failed.');
    }
  }

  return (
    <form onSubmit={step === 'enter' ? handleCreate : handleVerify} className="grid gap-4 px-6 py-6">
      {(finishState.error || error) && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {finishState.error || error}
        </div>
      )}

      <div className="grid gap-1">
        <label className="text-sm font-medium">Email *</label>
        <input
          value={emailReadOnly ? email : emailInput}
          onChange={(e) => !emailReadOnly && setEmailInput(e.target.value)}
          readOnly={emailReadOnly}
          className={`rounded-xl border ${
            emailReadOnly ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white'
          } px-3 py-2 focus:ring-2`}
          placeholder="you@example.com"
          inputMode="email"
        />
      </div>

      {step === 'enter' ? (
        <>
          <div className="grid gap-1">
            <label className="text-sm font-medium">First name *</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Last name *</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2"
              placeholder="+15551234567 or 555-123-4567"
              inputMode="tel"
            />
          </div>

          <AddCBOAddress
            street={address.street}
            city={address.city}
            state={address.state}
            postalCode={address.postalCode}
            country={address.country}
            onAddressChange={onAddressChange}
          />

          <div className="grid gap-1">
            <label className="text-sm font-medium">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Create Account
          </button>
        </>
      ) : (
        <>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Verification code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2"
              inputMode="numeric"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Verify & Finish
          </button>
        </>
      )}
    </form>
  );
}
