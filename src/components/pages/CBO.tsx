'use client';

import React from 'react';
import LoadingSpinner from '@/components/loadingScreen';
import CBOComponent from '@/components/CBOComponent';
import CBOFooter from '../CBOFooter';
import CBOHeader from '../CBOHeader';



interface CBOPageProps {
    cboData: any;
    
}

const CBOPage: React.FC<CBOPageProps> = ({ cboData }) => {

    
      if (!cboData) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p>CBO data not found.</p>
          </div>
        );
      }



    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pb-14">
                <CBOHeader user={cboData} />
            </div>

            {/* Main content area */}

            <CBOComponent user={cboData} />
            <CBOFooter />

        </div>
    );


};

export default CBOPage;
