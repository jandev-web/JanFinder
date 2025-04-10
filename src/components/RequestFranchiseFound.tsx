'use client';

import React, { useState } from 'react';
import RequestJoinFranchiseConfirm from './RequestJoinFranchiseConfirm';
import requestJoinFranchise from '@/utils/requestToJoinFranchise';
import AddressForm from '@/components/AddressForm';
import checkUserPoolEmail from '@/utils/checkUserPoolEmail';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface SelfCBOSignUpProps {
  franchise: any;
}

const RequestFranchiseFound: React.FC<SelfCBOSignUpProps> = ({ franchise }) => {
  const franchiseID = franchise?.FranchiseID;
  const franchiseName = franchise?.franchiseName;

  // Form state
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
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [hasChecked,setHasChecked] = useState(false)

  const router = useRouter();

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

  // When the email input loses focus, check whether the email exists
  const handleEmailBlur = async () => {
    if (!email) return;
    try {
      const response = await checkUserPoolEmail(email);
      // Assume response exists as { exists: boolean }
      setEmailExists(response.exists);
      setHasChecked(true)
    } catch (err) {
      console.error("Error checking email:", err);
    }
  };

  // The form is valid only if all fields are non-empty and the email is not already in use.
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
    !emailExists;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (franchiseID) {
        const addressObj: Address = {
          street,
          city,
          state,
          postalCode,
          country,
        };
        const cboData = { email, firstName, lastName, franchiseID, address: addressObj, phone };
        const result = await requestJoinFranchise(cboData);
        if (result) {
          setSubmitted(true);
        } else {
          setError('Failed to request to join the franchise. Please try again.');
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailExists(false); // reset when email changes
                }}
                onBlur={handleEmailBlur}
                required
                className="w-full p-4 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
              {emailExists && (
                <p className="text-red-500 text-sm mt-1">
                  This email is already in use. Have an account?{' '}
                  <Link href="/members/sign-in" className="underline hover:text-yellow-500">
                    Click here to sign in.
                  </Link>
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

            {/* Only render the submit button if all required information is entered and the email is not used */}
            {(isFormValid && !emailExists && hasChecked)? (
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-colors ${
                  loading ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {loading ? 'Submitting...' : 'Request to Join Franchise'}
              </button>
            ) : (
              <div className="w-full py-2 text-center text-gray-500">
                Please complete all fields.
              </div>
            )}
          </form>

          {error && <div className="mt-4 text-red-500">{error}</div>}
          {success && <div className="mt-4 text-green-500">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default RequestFranchiseFound;
