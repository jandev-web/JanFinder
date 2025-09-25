'use client';

import React, { useActionState } from 'react';   // ⬅️ useActionState from 'react'
import { useFormStatus } from 'react-dom';       // ⬅️ keep useFormStatus here
import { useRouter } from 'next/navigation';
import FranchiseAddressForm from '@/components/FranchiseAddressForm';

export type ActionState = { ok: boolean; error?: string | null };

type Props = {
  // ⬅️ signature expected by useActionState: (prevState, formData) => Promise<State>
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  states: string[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
    >
      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-white/80 group-hover:bg-white" />
      {pending ? 'Saving…' : 'Save & Continue'}
    </button>
  );
}

function PendingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur">
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-pulse rounded-full" />
          <span className="text-sm text-gray-700">Updating your franchise…</span>
        </div>
      </div>
    </div>
  );
}

export default function SetupForm({ action, states }: Props) {
  const router = useRouter();

  // Controlled address fields (stay put while pending)
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [stateVal, setStateVal] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [country, setCountry] = React.useState('United States');

  const onAddressChange = (
    field: 'street' | 'city' | 'state' | 'postalCode' | 'country',
    value: string
  ) => {
    if (field === 'street') setStreet(value);
    if (field === 'city') setCity(value);
    if (field === 'state') setStateVal(value);
    if (field === 'postalCode') setPostalCode(value);
    if (field === 'country') setCountry(value);
  };

  // ⬅️ useActionState instead of useFormState
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    { ok: false, error: null }
  );

  React.useEffect(() => {
    if (state.ok) router.replace('/business/owner');
  }, [state.ok, router]);

  return (
    <form action={formAction} className="relative px-6 py-6 space-y-8">
      <PendingOverlay />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Franchise Name</label>
          <input
            name="franchiseName"
            required
            placeholder="e.g., Synergy Cleaning – Westchester"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-2"
          />
        </div>
      </div>

      <FranchiseAddressForm
        street={street}
        city={city}
        state={stateVal}
        postalCode={postalCode}
        country={country}
        onAddressChange={onAddressChange}
        className="space-y-4"
        title="Franchise Address"
      />

      {/* Ensure names match what your server action reads */}
      <input type="hidden" name="street" value={street} />
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="state" value={stateVal} />
      <input type="hidden" name="postalCode" value={postalCode} />
      <input type="hidden" name="country" value={country} />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Service Regions</label>
        <p className="text-xs text-gray-500">Select all states where your franchise operates.</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {states.map((s) => (
            <label
              key={s}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <input
                type="checkbox"
                name="regions"
                value={s}
                className="h-4 w-4 rounded border-gray-300 focus:ring-emerald-500"
              />
              <span className="tabular-nums">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <a
          href="/business/owner"
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Cancel
        </a>
        <SubmitButton />
      </div>
    </form>
  );
}
