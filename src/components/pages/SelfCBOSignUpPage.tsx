import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import SelfCBOSignUp from '../SelfSignUpCBO';

interface TokenPayload {
  owner_id: string;
  exp: number;
  franchise_name: string;
  email: string;
}

const SelfCBOSignUpPage: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setError('Unauthorized: No token provided.');
      return;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      // Check if the token has expired (exp is in seconds, Date.now() returns ms)
      if (decoded.exp * 1000 < Date.now()) {
        setError('Unauthorized: Token has expired.');
      } else {
        console.log(decoded)
        setPayload(decoded);
      }
    } catch (e) {
      setError('Unauthorized: Invalid token.');
    }
  }, [token]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-[#001F54] mb-4">
        Sign Up for {payload.franchise_name}
      </h1>
      <SelfCBOSignUp ownerID={payload.owner_id} cboEmail={payload.email} />
    </div>
  );
};

export default SelfCBOSignUpPage;
