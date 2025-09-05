'use client'

import React, { useEffect, useState } from 'react';

import CBOAvaQuotes from '@/components/CBOAvailableQuotes';
import CBOFooter from '../CBOFooter';
import CBOHeader from '../CBOHeader';





interface CBOAvaQuotesPageProps {
    cboData: any;
    quotes: any;
}

const CBOAvaQuotesPage: React.FC<CBOAvaQuotesPageProps> = ({ cboData, quotes }) => {
      console.log(quotes)
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
                <CBOAvaQuotes user={cboData} quotes={quotes} />
            </div>
            <CBOFooter />

        </div>
    );


};

export default CBOAvaQuotesPage;
