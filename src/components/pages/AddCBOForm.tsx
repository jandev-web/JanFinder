'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AddressForm from '@/components/AddressForm';
import checkUserPoolEmail from '@/utils/checkUserPoolEmail';
import LoadingSpinner from '../loadingScreen';

interface CreateCBOFormProps {
  user: any;
  handleSubmitAction: (cboData: any) => Promise<void>;
  buttonMessage: string;
}

const CreateCBOForm: React.FC<CreateCBOFormProps> = ({ user, handleSubmitAction, buttonMessage }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

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
      default:
        break;
    }
  };

  const handleEmailBlur = async () => {
    if (!email) return;
    try {
      const response = await checkUserPoolEmail(email);
      // Assume response shape: { exists: boolean }
      setEmailExists(response.exists);
      setHasChecked(true);
    } catch (err) {
      console.error('Error checking email:', err);
    }
  };
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    email &&
    phone &&
    firstName &&
    lastName &&
    street &&
    city &&
    state &&
    postalCode &&
    country &&
    isEmailValid &&
    !emailExists;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setError('');
    const address = { street, city, state, postalCode, country };

    try {
      if (user) {
        const ownerID = user.OwnerID;
        const cboData = { email, firstName, lastName, ownerID, address, phone };
        await handleSubmitAction(cboData);
        // Reset fields after successful submission
        setPhone('');
        setFirstName('');
        setLastName('');
        setStreet('');
        setCity('');
        setCountry('');
        setPostalCode('');
        setState('');
        setEmail('');
      } else {
        console.error('No User ID provided.');
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-semibold text-[#001F54] border-b-2 border-yellow-500 inline-block pb-1 mb-6">
        Franchise Member Information
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailExists(false);
            }}
            onBlur={handleEmailBlur}
            required
            className="w-full p-4 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
          {emailExists && (
            <p className="text-red-500 text-sm mt-1">
              This email is already in use. Have an account?{' '}
              <Link href="/business/sign-in" className="underline hover:text-yellow-500">
                Click here to sign in.
              </Link>
            </p>
          )}
          {((email != '') && !isEmailValid) && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid email.
            </p>
          )}
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

        {isFormValid && !emailExists && hasChecked ? (
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {loading ? 'Submitting...' : buttonMessage}
          </button>
        ) : (
          <div className="w-full py-2 text-center text-gray-500">Please complete all fields.</div>
        )}
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default CreateCBOForm;
