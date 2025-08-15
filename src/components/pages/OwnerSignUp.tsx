'use client';

import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import createOwner from '@/utils/createOwner';
// import createFranchise from '@/utils/createFranchise'; // ⛔️ not here — done after first sign-in
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';
import { useRouter } from 'next/navigation';
import getAllRegions from '@/utils/getAllServiceRegions';
import Link from 'next/link';
import Image from 'next/image';
import AddressForm from '@/components/AddressForm';
import SelectOwnerRegions from '@/components/SelectOwnerRegions';
import { signUp } from 'aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';

import "@aws-amplify/ui-react/styles.css";


const CreateOwnerForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };
  const toE164 = (uiPhone: string) => {
    const digits = uiPhone.replace(/\D/g, '');
    return digits ? `+1${digits.slice(-10)}` : '';
  };

  // Strong password: 12+ chars, upper/lower/number/symbol
  const validatePassword = (pwd: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(pwd);

  const getPasswordStrength = () => {
    if (!password) return '';
    if (password.length < 12) return 'Too short';
    return validatePassword(password) ? 'Strong' : 'Weak';
    // (wire this into the UI if you want)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validatePassword(password)) {
      setError('Password must be 12+ chars with upper, lower, number, and symbol.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // 1) Create the Cognito user (Owner) — no invite required
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            phone_number: toE164(phone),
            'custom:role': 'Owner',
            'custom:FranchiseID': uuidv4()
          },
        },
      });


      setSuccess('Account created! Check your email to verify, then sign in to finish setup.');
      router.push('/members/sign-in');
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center pt-10 pb-10 justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/janitorSignUpPic.jpeg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#001F54] to-[#003a85] opacity-80"></div>

      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Join <span className="text-yellow-500">Bid2Clean</span>
        </h1>

        <div className="flex justify-center mb-12">
          <div className="relative w-60 h-60 rounded-full bg-gradient-to-r from-blue-800 to-yellow-400 animate-spin-slow flex items-center justify-center">
            <Image src="/images/signUpOwnerPic.jpeg" alt="Business Owner" className="animate-reverse-spin-slow rounded-full object-cover" fill />
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Empower your business with more jobs and streamlined tools.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">Phone #:</label>
            <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2">First Name:</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2">Last Name:</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
              />
              <span className="absolute right-3 top-2 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">Confirm Password:</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
              />
              <span className="absolute right-3 top-2 cursor-pointer" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                {confirmPasswordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mt-4 text-green-500 text-sm">{success}</div>}

        <div className="mt-4 text-center">
          <Link href="/members/sign-in" className="text-[#001F54] text-sm hover:underline">
            Already Have a Members Account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateOwnerForm;
