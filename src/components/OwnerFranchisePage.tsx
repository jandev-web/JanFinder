'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FranchiseInfo from './FranchiseInfo';
interface OwnerFranchisePageProps {
    user: any;
    userInfo: any;
    franchise: any;
}

const OwnerFranchisePage: React.FC<OwnerFranchisePageProps> = ({ userInfo, user, franchise }) => {
    const router = useRouter();
    const franchiseID = userInfo?.franchiseID
    const ownerID = userInfo?.OwnerID
    console.log(franchise)
    

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4 text-center">
                {/* Franchise Name */}
                <h2 className="text-4xl font-bold text-[#001F54] mb-6">Franchise Information</h2>
                <FranchiseInfo franchise={franchise} ownerID={ownerID} />
            </div>
        </div>
    );
};

export default OwnerFranchisePage;
