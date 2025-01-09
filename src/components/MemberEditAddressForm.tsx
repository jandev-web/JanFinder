"use client";
/// <reference types="@types/google.maps" />

import React, { useState, useEffect } from 'react';
import { updateFacilityInfo } from '@/utils/memberUpdateFacilityInfo'

interface AddressFormProps {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  quoteID: any;
  onAddressChange: (field: string, value: string) => void;
}

const MemberEditAddressForm: React.FC<AddressFormProps> = ({
  street,
  city,
  state,
  postalCode,
  country,
  quoteID,
  onAddressChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (document.getElementById("google-maps-script")) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.id = "google-maps-script";
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      const input = document.getElementById('addressInput') as HTMLInputElement;
      if (!input || !window.google) return;

      const autocomplete = new google.maps.places.Autocomplete(input, { types: ['address'] });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const addressComponents = place.address_components || [];

        const getAddressComponent = (type: string) =>
          addressComponents.find((comp) => comp.types.includes(type))?.long_name || '';

        onAddressChange('street', `${getAddressComponent('street_number')} ${getAddressComponent('route')}`);
        onAddressChange('city', getAddressComponent('locality'));
        onAddressChange('state', getAddressComponent('administrative_area_level_1'));
        onAddressChange('postalCode', getAddressComponent('postal_code'));
        onAddressChange('country', getAddressComponent('country'));
      });
    };

    loadGoogleMapsScript();
  }, [onAddressChange]);

  const confirmEdit = async () => {
    try {
        await updateFacilityInfo(quoteID, street, city, state, postalCode, country);
        setIsEditing(false);
    } catch (error) {
        console.error('Error updating facility info:', error);
    }
  }

  const displayValue = (value: string | undefined) => {
    return value && value.trim() !== '' ? value : 'None';
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-[#001F54] border-b-2 border-yellow-500 inline-block pb-1 mb-6">
        Address Information
      </h3>

      {!isEditing ? (
        <>
          <p className="text-lg text-white">Street: {displayValue(street)}</p>
          <p className="text-lg text-white">City: {displayValue(city)}</p>
          <p className="text-lg text-white">State: {displayValue(state)}</p>
          <p className="text-lg text-white">Postal Code: {displayValue(postalCode)}</p>
          <p className="text-lg text-white">Country: {displayValue(country)}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition"
          >
            Edit Address
          </button>
        </>
      ) : (
        <>
          <input
            id="addressInput"
            type="text"
            placeholder="Street Address"
            value={street}
            onChange={(e) => onAddressChange('street', e.target.value)}
            className="w-full text-black p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => onAddressChange('city', e.target.value)}
            className="w-full text-black p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => onAddressChange('state', e.target.value)}
            className="w-full text-black p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => onAddressChange('postalCode', e.target.value)}
            className="w-full text-black p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => onAddressChange('country', e.target.value)}
            className="w-full text-black p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
          <button
            onClick={confirmEdit}
            className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition"
          >
            Confirm
          </button>
        </>
      )}
    </div>
  );
};

export default MemberEditAddressForm;
