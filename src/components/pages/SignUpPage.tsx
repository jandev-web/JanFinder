'use client'

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import fetchOwnerById from '@/utils/getOwnerById';
import LoadingSpinner from '@/components/loadingScreen'
import OwnerFooter from '../OwnerFooter';
import AddCBOPage from '@/components/pages/AddCBOPage';
import OwnerHeader from '../OwnerHeader';
import SignUp from '../SignUp';


const SignUpPage: React.FC = () => {
    
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header with padding-bottom */}
            
            <div className='pb-16'>
              <SignUp />
            </div>
            
            
              <OwnerFooter />
            
            

        </div>
    );


};

export default SignUpPage;
