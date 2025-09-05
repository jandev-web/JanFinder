'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID';
import LoadingSpinner from '@/components/loadingScreen'
import CBOFooter from '../CBOFooter';
import AllQuotes from '../CBOAllQuotes';
import CBOHeader from '../CBOHeader';

import { useRouter } from 'next/navigation';



interface CBOAllQuotesPageProps {
    cboData: any;
}

const CBOAllQuotesPage: React.FC<CBOAllQuotesPageProps> = ({ cboData }) => {
    const router = useRouter()
  
      if (!cboData) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p>CBO data not found.</p>
          </div>
        );
      }


    
    return (
        <div className="flex w-full flex-col min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pb-10">
                <CBOHeader user={cboData} />
            </div>

            <div className='pt-24'>
              <AllQuotes />
            </div>
            <CBOFooter />
            

        </div>
    );


};

export default CBOAllQuotesPage;
