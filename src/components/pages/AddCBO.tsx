'use client';

import React, { useState } from 'react';
import createCBO from '@/utils/createCBO';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddressForm from '@/components/AddressForm';

interface AddCBOPageProps {
  user: any;
}

const CreateCBOForm: React.FC<AddCBOPageProps> = ({ user }) => {
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
  const [success, setSuccess] = useState('');
  const router = useRouter();
  console.log(user?.sub)

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
    setSuccess('');
    const address = 
      {
        'street': street,
        'city': city,
        'state': state,
        'postalCode': postalCode,
        'country': country
      }

    try {
      if (user.sub) {
        const ownerID = user.sub

        const cboData = { email, firstName, lastName, ownerID, address, phone };
        const result = await createCBO(cboData);
        setSuccess('CBO created successfully!');
        router.push('/members/owner/CBOs')
      }
      else {
        console.error('No User ID')
      }

    } catch (err) {

      if (err instanceof Error) {
        setError(err.message || 'Failed to create CBO. Please try again.');
      } else {
        setError('An unknown error occurred. Please try again.');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full top-0 left-0 bg-gray-100 w-full overflow-x-hidden">
      {/* Banner with "Back" button */}
      <div className="bg-gray-800 text-white py-2 px-4 flex items-center w-full">
        <Link href="/members/owner/CBOs" className="flex items-center text-white hover:text-green-300">
          {/* Arrow Icon and Back Text */}
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Form Container */}
      <div className="flex items-center justify-center min-h-full w-full">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-8">
          <h1 className="text-2xl font-bold text-green-500 mb-6">Create CBO Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                id="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <input
                type="tel"
                id="phone"
                placeholder='Phone (###)-###-####'
                value={phone}
                onChange={handlePhoneChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              
              <input
                type="text"
                id="firstName"
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <input
                type="text"
                id="lastName"
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className={`w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''
                }`}
            >
              {loading ? 'Creating...' : 'Create CBO'}
            </button>
          </form>

          {error && <div className="mt-4 text-red-500">{error}</div>}
          {success && <div className="mt-4 text-green-500">{success}</div>}
        </div>
      </div>
    </div>
  );
};


export default CreateCBOForm;
