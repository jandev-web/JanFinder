'use client';

import React, { useEffect, useState } from 'react';
import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';
import QuoteDetails from '@/components/MemberStartQuoteDetails';


interface MemberStartQuotePageProps {
    user: any;
}

const MemberStartQuotePage: React.FC<MemberStartQuotePageProps> = ({ user }) => {
    const [buildingData, setBuildingData] = useState([]);
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCBOBuildingTypes();
                setBuildingData(data);
            } catch (error) {
                console.error('Error fetching building data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <div className="w-full max-w-lg p-10">
                <h1 className="text-3xl font-extrabold text-[#001F54] mb-6 border-b-2 border-yellow-500 pb-2 text-center">
                    Start a New Quote
                </h1>
                <QuoteDetails buildingData={buildingData} user={user} />
            </div>
        </div>
    );
    
};

export default MemberStartQuotePage;

