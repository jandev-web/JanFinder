// components/forms/AddCBOAddress.tsx
'use client';
/// <reference types="@types/google.maps" />

import React, { useEffect } from 'react';

interface AddressFormProps {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  onAddressChange: (field: string, value: string) => void;
}

const AddCBOAddress: React.FC<AddressFormProps> = ({
  street,
  city,
  state,
  postalCode,
  country,
  onAddressChange,
}) => {
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (document.getElementById('google-maps-script')) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.id = 'google-maps-script';
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      const input = document.getElementById('addressInput') as HTMLInputElement | null;
      if (!input || !(window as any).google) return;

      const autocomplete = new google.maps.places.Autocomplete(input, { types: ['address'] });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const components = place.address_components || [];

        const get = (type: string) =>
          components.find(c => c.types.includes(type))?.long_name || '';

        onAddressChange('street', `${get('street_number')} ${get('route')}`.trim());
        onAddressChange('city', get('locality') || get('postal_town'));
        onAddressChange('state', get('administrative_area_level_1'));
        onAddressChange('postalCode', get('postal_code'));
        onAddressChange('country', get('country'));
      });
    };

    loadGoogleMapsScript();
  }, [onAddressChange]);

  return (
    <div className="grid gap-4">
      <h3 className="text-lg font-semibold text-[#001F54]">Address</h3>

      <input
        id="addressInput"
        type="text"
        placeholder="Start typing an address…"
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
      />

      <div className="grid gap-1">
        <label className="text-sm font-medium">Street</label>
        <input
          type="text"
          value={street}
          onChange={(e) => onAddressChange('street', e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => onAddressChange('city', e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
            placeholder="New York"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => onAddressChange('state', e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
            placeholder="NY"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => onAddressChange('postalCode', e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
            placeholder="10001"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => onAddressChange('country', e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2"
            placeholder="United States"
          />
        </div>
      </div>
    </div>
  );
};

export default AddCBOAddress;
