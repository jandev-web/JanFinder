// components/pages/AddCBOEmailForm.tsx
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

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
      {pending ? 'Sending…' : 'Send Invite'}
    </button>
  );
}

export default function AddCBOEmailForm({ action }: Props) {
  const router = useRouter();
  const [state, formAction] = React.useActionState<ActionState, FormData>(action, { ok: false, error: null });
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState<string>('');

  React.useEffect(() => {
    if (state.ok) {
      // Go back to list or show a toast in your app shell
      router.replace('/business/owner/cbo?invited=1');
    }
  }, [state.ok, router]);

  const validateEmail = (v: string) => {
    if (!v.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v)) return 'Please enter a valid email.';
    return '';
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const err = validateEmail(email);
    setEmailError(err);
    if (err) e.preventDefault();
  };

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-4 px-6 py-6">
      {state.error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</div>
      )}

      <div className="grid gap-1">
        <label className="text-sm font-medium">Email *</label>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
          onBlur={(e) => setEmailError(validateEmail(e.target.value))}
          aria-invalid={!!emailError}
          aria-describedby="email-help"
          className={`rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2 ${
            emailError ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="jane@example.com"
        />
        {emailError && <p id="email-help" className="text-xs text-red-600">{emailError}</p>}
      </div>

      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
