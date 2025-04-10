'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CBOFranchiseInfo from './CBOFranchiseInfo';
interface CBOFranchisePageProps {
    franchise: any;
    owner: any;
}

const CBOFranchisePage: React.FC<CBOFranchisePageProps> = ({ franchise, owner }) => {
    
    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4 text-center">
                {/* Franchise Name */}
                <h2 className="text-4xl font-bold text-[#001F54] mb-6">Franchise Information</h2>
                <CBOFranchiseInfo franchise={franchise} owner={owner} />
            </div>
        </div>
    );
};

export default CBOFranchisePage;
