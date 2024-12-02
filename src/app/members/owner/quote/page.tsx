'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OwnerQuote from '@/components/pages/SingleOwnerQuote';
import OwnerHeader from '@/components/OwnerHeader';
import { useUser } from '@/components/UserContext';
import { useRouter } from 'next/navigation';

const SingleOwnerQuotePage = () => {
  const { attributes } = useUser();
  const currentUser = attributes;
  const searchParams = useSearchParams();
  const router = useRouter();

  const quoteParam = searchParams.get('quoteID');
  const prevPage = searchParams.get('page');
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full pb-12">
        <OwnerHeader user={currentUser} />
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center mt-10">
        <OwnerQuote user={currentUser} quoteID={quoteParam} prevPage={prevPage} />
      </div>
    </div>
  );
};

export default SingleOwnerQuotePage;
