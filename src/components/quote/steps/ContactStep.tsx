'use client';
/// <reference types="@types/google.maps" />

import React, { useEffect, useRef } from 'react';
import type { ContactInfo, ValidationErrors } from '@/types/quote-ui';

interface ContactStepProps {
  data: ContactInfo;
  onChange: (data: ContactInfo) => void;
  errors: ValidationErrors;
}

/** Format a string of digits to (111) 111-1111.
 *  - Empty when no digits
 *  - Adds "(" immediately when the first digit appears
 */
function formatUSPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10); // limit to 10
  if (!digits.length) return '';

  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);

  if (digits.length < 4) return `(${a}`;
  if (digits.length < 7) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
}

export default function ContactStep({ data, onChange, errors }: ContactStepProps) {
  const addrInputRef = useRef<HTMLInputElement | null>(null);
  const dataRef = useRef<ContactInfo>(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Safe merge into the latest data
  const patch = (updates: Partial<ContactInfo>) => {
    onChange({ ...dataRef.current, ...updates });
  };

  const updateField = (field: keyof ContactInfo, value: string) => {
    patch({ [field]: value } as Partial<ContactInfo>);
  };

  // Phone uses patch so it never clobbers other fields
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    patch({ phone: formatUSPhone(digits) });
  };

  useEffect(() => {
    const init = () => {
      const input = addrInputRef.current;
      if (!input || !window.google?.maps?.places) return;

      const ac = new google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: ['us'] },
        fields: ['address_components', 'formatted_address'],
      });

      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        const comps = place.address_components || [];
        const get = (t: string, short = false) =>
          comps.find((c) => c.types.includes(t))?.[short ? 'short_name' : 'long_name'] || '';

        const street = `${get('street_number')} ${get('route')}`.trim();
        const city = get('locality') || get('sublocality') || get('postal_town');
        const state = get('administrative_area_level_1', true);
        const postal = get('postal_code');

        // Use patch so only these fields change
        patch({
          address: street,
          city,
          state,
          postalCode: postal,
        });
      });
    };

    const ensureScript = () => {
      if (window.google?.maps?.places) return init();
      const existing = document.getElementById('google-maps-script') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', init, { once: true });
        return;
      }
      const s = document.createElement('script');
      s.id = 'google-maps-script';
      s.async = true;
      s.defer = true;
      s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      s.addEventListener('load', init, { once: true });
      document.head.appendChild(s);
    };

    ensureScript();
  }, []);


  return (
    <div className="space-y-6">
      {/* First/Last */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.firstName
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="Enter your first name"
            autoComplete="given-name"
          />
          {errors.firstName && <p className="text-red-600 text-sm mt-2">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.lastName
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="Enter your last name"
            autoComplete="family-name"
          />
          {errors.lastName && <p className="text-red-600 text-sm mt-2">{errors.lastName}</p>}
        </div>
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          id="company"
          type="text"
          value={data.company}
          onChange={(e) => updateField('company', e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
            errors.company
              ? 'border-red-500 ring-2 ring-red-500'
              : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
          }`}
          placeholder="Enter your company name"
          autoComplete="organization"
        />
        {errors.company && <p className="text-red-600 text-sm mt-2">{errors.company}</p>}
      </div>

      {/* Email / Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.email
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="your@email.com"
            autoComplete="email"
            inputMode="email"
          />
          {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
              e.preventDefault();
              const paste = e.clipboardData.getData('text');
              handlePhoneChange(paste);
            }}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.phone
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="(555) 123-4567"
            autoComplete="tel"
            inputMode="numeric"
            aria-label="Phone number, formatted as (555) 123-4567"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
        </div>
      </div>

      {/* Address Autocomplete + City/State/ZIP */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
          Street Address *
        </label>
        <input
          id="address"
          ref={addrInputRef}
          type="text"
          value={data.address}
          onChange={(e) => updateField('address', e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
            errors.address
              ? 'border-red-500 ring-2 ring-red-500'
              : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
          }`}
          placeholder="123 Business Street"
          autoComplete="street-address"
        />
        {errors.address && <p className="text-red-600 text-sm mt-2">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input
            id="city"
            type="text"
            value={data.city}
            onChange={(e) => updateField('city', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.city
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="City"
            autoComplete="address-level2"
          />
          {errors.city && <p className="text-red-600 text-sm mt-2">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
            State *
          </label>
          <input
            id="state"
            type="text"
            value={data.state}
            onChange={(e) => updateField('state', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.state
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="State"
            autoComplete="address-level1"
          />
          {errors.state && <p className="text-red-600 text-sm mt-2">{errors.state}</p>}
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            id="postalCode"
            type="text"
            value={data.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.postalCode
                ? 'border-red-500 ring-2 ring-red-500'
                : 'border-gray-300 focus:ring-[#001F54] focus:border-[#001F54]'
            }`}
            placeholder="12345"
            autoComplete="postal-code"
            inputMode="numeric"
          />
          {errors.postalCode && <p className="text-red-600 text-sm mt-2">{errors.postalCode}</p>}
        </div>
      </div>
    </div>
  );
}
