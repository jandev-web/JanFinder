'use client';
/// <reference types="@types/google.maps" />

import React, { useEffect, useMemo, useRef } from 'react';

type AddressFields = 'street' | 'city' | 'state' | 'postalCode' | 'country';

export type FranchiseAddressFormProps = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  onAddressChange: (field: AddressFields, value: string) => void;
  /**
   * Restrict autocomplete to certain countries (ISO 3166-1 Alpha-2).
   * Defaults to ['us'].
   */
  countryRestrictions?: string[];
  className?: string;
  title?: string;
};

let googleScriptLoading: Promise<void> | null = null;

export default function FranchiseAddressForm({
  street,
  city,
  state,
  postalCode,
  country,
  onAddressChange,
  countryRestrictions = ['us'],
  className = '',
  title = 'Address Information',
}: FranchiseAddressFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const scriptSrc = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
    const libs = 'places';
    const url = new URL('https://maps.googleapis.com/maps/api/js');
    url.searchParams.set('key', key);
    url.searchParams.set('libraries', libs);
    return url.toString();
  }, []);

  useEffect(() => {
    // Don’t run on server
    if (typeof window === 'undefined') return;

    const ensureScript = () => {
      if ((window as any).google?.maps?.places) {
        return Promise.resolve();
      }
      if (googleScriptLoading) return googleScriptLoading;

      googleScriptLoading = new Promise<void>((resolve, reject) => {
        // If a script with same src already exists, reuse it
        const existing = Array.from(document.getElementsByTagName('script')).find(s => s.src === scriptSrc);
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
          return;
        }

        const s = document.createElement('script');
        s.src = scriptSrc;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Google Maps failed to load'));
        document.head.appendChild(s);
      });

      return googleScriptLoading;
    };

    const initAutocomplete = async () => {
      await ensureScript();
      if (!inputRef.current || !(window as any).google?.maps?.places) return;

      // Clean old listener/instance if re-init
      if (listenerRef.current) {
        listenerRef.current.remove();
        listenerRef.current = null;
      }
      acRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry'],
        componentRestrictions: { country: countryRestrictions },
      });

      listenerRef.current = acRef.current.addListener('place_changed', () => {
        const place = acRef.current?.getPlace();
        const comps = place?.address_components || [];

        const get = (type: string, short = false) => {
          const c = comps.find(comp => comp.types.includes(type));
          if (!c) return '';
          return short ? c.short_name : c.long_name;
        };

        const streetNumber = get('street_number');
        const route = get('route');
        const locality = get('locality') || get('postal_town'); // fallback for some regions
        const adminLvl1 = get('administrative_area_level_1', true); // short_name keeps "NY", "CA"
        const postal = get('postal_code');
        const ctry = get('country');

        onAddressChange('street', [streetNumber, route].filter(Boolean).join(' ').trim());
        onAddressChange('city', locality);
        onAddressChange('state', adminLvl1);
        onAddressChange('postalCode', postal);
        onAddressChange('country', ctry);
      });
    };

    initAutocomplete();

    return () => {
      // Cleanup
      if (listenerRef.current) {
        listenerRef.current.remove();
        listenerRef.current = null;
      }
      acRef.current = null;
    };
  }, [onAddressChange, scriptSrc, countryRestrictions]);

  return (
    <section className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

      {/* Google Autocomplete input (free-form) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Search Address</label>
        <input
          ref={inputRef}
          id="franchise-address-autocomplete"
          type="text"
          autoComplete="street-address"
          placeholder="Start typing your address…"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-2 placeholder:text-gray-400"
        />
      </div>

      {/* Structured fields (match your franchise form styling) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Street</label>
        <input
          name="street"
          value={street}
          onChange={(e) => onAddressChange('street', e.target.value)}
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
          <input
            name="city"
            value={city}
            onChange={(e) => onAddressChange('city', e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-2"
          />
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
          <input
            name="state"
            value={state}
            onChange={(e) => onAddressChange('state', e.target.value)}
            placeholder="NY"
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 uppercase outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-2"
          />
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Zip</label>
          <input
            name="postalCode"
            value={postalCode}
            onChange={(e) => onAddressChange('postalCode', e.target.value)}
            inputMode="numeric"
            pattern="\d{5}(-\d{4})?"
            placeholder="10601"
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
        <input
          name="country"
          value={country}
          onChange={(e) => onAddressChange('country', e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-2"
        />
      </div>
    </section>
  );
}
