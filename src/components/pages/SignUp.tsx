'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // You may need to install Heroicons or use a similar icon library
import createOwner from '@/utils/createOwner';
import createFranchise from '@/utils/createFranchise';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading'
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import Link from 'next/link';
import Image from 'next/image';


const CreateOwnerForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [franchiseName, setFranchiseName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Password validation function
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Too short';
    if (!validatePassword(password)) return 'Weak';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const franchiseResult = await createFranchise(franchiseName);
      if (franchiseResult.franchiseID) {
        const franchiseID = franchiseResult.franchiseID;

        const ownerData = { email, firstName, lastName, franchiseID, password };
        await createOwner(ownerData);

        setSuccess('Account created successfully!');

        router.push('/members/sign-in');
        return (

          <MemberLoadingScreen />


        )
      } else {
        throw new Error('No Franchise ID returned');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create account. Please try again.');
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center pt-10 pb-10 justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/janitorSignUpPic.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001F54] to-[#003a85] opacity-80"></div>

      {/* Form Container */}
      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Join <span className="text-yellow-500">JanFinder</span>
        </h1>

        {/* Yellow Circle with Image */}
        {/* Rotating Circle with Image */}
        <div className="flex justify-center mb-12">
          <div className="relative w-60 h-60 rounded-full bg-gradient-to-r from-blue-800 to-yellow-400 animate-spin-slow flex items-center justify-center">
            <Image
              src="/images/signUpOwnerPic.jpeg"
              alt="Business Owner"
              className="animate-reverse-spin-slow rounded-full object-cover"
              fill
            />

          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Empower your business with more jobs and streamlined tools.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
            />
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2">
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2">
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
            />
          </div>

          {/* Franchise Name */}
          <div>
            <label htmlFor="franchiseName" className="block text-gray-700 font-semibold mb-2">
              Franchise Name:
            </label>
            <input
              type="text"
              id="franchiseName"
              value={franchiseName}
              onChange={(e) => setFranchiseName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password:
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F54]"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        {/* Error and Success Messages */}
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mt-4 text-green-500 text-sm">{success}</div>}

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link href="/members" className="text-[#001F54] text-sm hover:underline">
            Already Have a Members Account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateOwnerForm;
