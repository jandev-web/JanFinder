'use client'

import React from 'react';

import OwnerFooter from '../OwnerFooter';
import AllQuotes from './AllQuotes';
import OwnerHeader from '../OwnerHeader';





interface OwnerAllQuotesPageProps {
    user: any;
}

const OwnerAllQuotesPage: React.FC<OwnerAllQuotesPageProps> = ({ user }) => {
    
    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Header with padding-bottom */}
            <div className="pb-10">
                <OwnerHeader user={user} />
            </div>

            <div className='pt-24'>
              <AllQuotes user={user} />
            </div>
            <OwnerFooter />
            

        </div>
    );


};

export default OwnerAllQuotesPage;
