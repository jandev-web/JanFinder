'use client';

import React from 'react';
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import { useSearchParams } from 'next/navigation';
import CBOQuote from '@/components/pages/SingleCBOQuotePage';
import CBOHeader from '@/components/CBOHeader';
import { useUser } from '@/components/UserContext';


const SingleCBOQuotePage = () => {
  const { attributes } = useUser();
  const user = attributes
  const searchParams = useSearchParams();

  const quoteParam = searchParams.get('quoteID');
  const prevPage = searchParams.get('page');
  return (

    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pt-10">
      <CBOHeader user={user} />
      </div>
      <div className="flex-1 flex pt-10">
        <CBOQuote user={user} quoteID={quoteParam} prevPage={prevPage} />
      </div>
    </div>

  );
};

export default SingleCBOQuotePage;
