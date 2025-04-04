'use client';

import React, { useState } from 'react';
import RequestJoinFranchiseConfirm from './RequestJoinFranchiseConfirm';
import requestJoinFranchise from '@/utils/requestToJoinFranchise';
import AddressForm from '@/components/AddressForm';

interface SelfCBOSignUpProps {
  franchise: any;
}

const RequestFranchiseFound: React.FC<SelfCBOSignUpProps> = ({ franchise }) => {
  const franchiseID = franchise?.FranchiseID;
  const franchiseName = franchise?.franchiseName;
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // New state flag to show the confirmation once form submission is successful
  const [submitted, setSubmitted] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const handleAddressChange = (field: string, value: string) => {
    switch (field) {
      case 'street':
        setStreet(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'postalCode':
        setPostalCode(value);
        break;
      case 'country':
        setCountry(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (franchiseID) {
        const address = {
          street,
          city,
          state,
          postalCode,
          country,
        };
        const cboData = { email, firstName, lastName, franchiseID, address, phone };
        const result = await requestJoinFranchise(cboData);
        if (result) {
          // Set the flag to show the confirmation component
          setSubmitted(true);
        } else {
          setError('Failed to create CBO. Please try again.');
        }
      } else {
        console.error('No Franchise ID');
      }
    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // When the form is successfully submitted, render the confirmation component
  if (submitted) {
    return <RequestJoinFranchiseConfirm franchiseName={franchiseName} />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gray-100">
      {/* Header */}
      <div className="flex justify-center items-center py-8">
        <h1 className="text-3xl font-bold text-[#001F54]">Join {franchiseName}</h1>
      </div>

      {/* Form Container */}
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white p-8 w-full max-w-md rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#001F54] border-b-2 border-yellow-500 inline-block pb-1 mb-6">
            Franchise Member Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>

            <div>
              <input
                type="tel"
                id="phone"
                placeholder="Phone (###)-###-####"
                value={phone}
                onChange={handlePhoneChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>

            <div>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>

            <div>
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>

            <AddressForm
              street={street}
              city={city}
              state={state}
              postalCode={postalCode}
              country={country}
              onAddressChange={handleAddressChange}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </form>

          {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default RequestFranchiseFound;
