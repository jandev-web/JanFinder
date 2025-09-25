// components/pages/AddCBOPage.tsx
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import AddCBOAddress from '@/components/AddCBOAddress';

export type ActionState = { ok: boolean; error: string | null };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 bg-emerald-600 hover:bg-emerald-700"
    >
      {pending ? 'Adding…' : 'Add Member'}
    </button>
  );
}

// Simple validators (client-side)
const emailRe =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
// Accepts digits, spaces, (), -, +, and must contain at least 10 digits; allows E.164 like +15551234567
const phoneDigits = (s: string) => (s.match(/\d/g) ?? []).length;
const phonePrettyRe = /^[0-9+\-\s()]*$/;

export default function AddCBOForm({ action }: Props) {
  const router = useRouter();

  // React 19 API
  const [state, formAction] = React.useActionState<ActionState, FormData>(action, {
    ok: false,
    error: null,
  });

  const [address, setAddress] = React.useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const [emailError, setEmailError] = React.useState<string>('');
  const [phoneError, setPhoneError] = React.useState<string>('');

  React.useEffect(() => {
    if (state.ok) router.replace('/business/owner/cbo');
  }, [state.ok, router]);

  const onAddressChange = (field: string, value: string) =>
    setAddress(prev => ({ ...prev, [field]: value }));

  const validateEmail = (v: string) => {
    if (!v.trim()) return 'Email is required.';
    if (!emailRe.test(v.trim())) return 'Please enter a valid email.';
    return '';
  };

  const validatePhone = (v: string) => {
    const trimmed = v.trim();
    if (!trimmed) return ''; // optional
    if (!phonePrettyRe.test(trimmed)) return 'Only digits, spaces, +, -, ( ) allowed.';
    if (phoneDigits(trimmed) < 10) return 'Enter at least 10 digits.';
    return '';
  };

  const onEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value;
    setEmail(v);
    setEmailError(validateEmail(v));
  };
  const onEmailBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setEmailError(validateEmail(e.target.value));
  };

  const onPhoneChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value;
    setPhone(v);
    setPhoneError(validatePhone(v));
  };
  const onPhoneBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setPhoneError(validatePhone(e.target.value));
  };

  // Intercept submit to block when invalid
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const eErr = validateEmail(email);
    const pErr = validatePhone(phone);
    setEmailError(eErr);
    setPhoneError(pErr);
    if (eErr || pErr) {
      e.preventDefault(); // do not call server action
    }
  };

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-4 px-6 py-6">
      {state.error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <div className="grid gap-1">
        <label className="text-sm font-medium">First name *</label>
        <input
          name="firstName"
          required
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
          placeholder="Jane"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Last name *</label>
        <input
          name="lastName"
          required
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
          placeholder="Doe"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Email *</label>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={onEmailChange}
          onBlur={onEmailBlur}
          aria-invalid={!!emailError}
          aria-describedby="email-help"
          className={`rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2 ${
            emailError ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="jane@example.com"
        />
        {emailError && (
          <p id="email-help" className="text-xs text-red-600">{emailError}</p>
        )}
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Phone</label>
        <input
          name="phone"
          value={phone}
          onChange={onPhoneChange}
          onBlur={onPhoneBlur}
          aria-invalid={!!phoneError}
          aria-describedby="phone-help"
          className={`rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2 ${
            phoneError ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="(555) 555-1234 or +1 555 555 1234"
        />
        {phoneError && (
          <p id="phone-help" className="text-xs text-red-600">{phoneError}</p>
        )}
      </div>

      <div className="mt-2">
        <AddCBOAddress
          street={address.street}
          city={address.city}
          state={address.state}
          postalCode={address.postalCode}
          country={address.country}
          onAddressChange={onAddressChange}
        />
      </div>

      {/* Serialize address for server action as a PLAIN object string */}
      <input type="hidden" name="address" value={JSON.stringify(address)} />

      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
