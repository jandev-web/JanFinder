'use client';

import React, { useEffect, useState } from 'react';
import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';
import QuoteDetails from '@/components/MemberStartQuoteDetails';
import fetchOwnerById from '@/utils/getOwnerById';
import fetchCBOById from '@/utils/getCBOByID';

interface MemberStartQuotePageProps {
    user: any;
}

const MemberStartQuotePage: React.FC<MemberStartQuotePageProps> = ({ user }) => {
    const [buildingData, setBuildingData] = useState([]);
    const [franchise, setFranchise] = useState('');
    const [cbo, setCbo] = useState('');

    console.log('User:', user);
    const ownerStatus = user?.['custom:isOwner'];
    console.log('Owner Status:', ownerStatus);

    useEffect(() => {
        const initializeCboAndFranchise = async () => {
            if (ownerStatus === 'true') {
                setCbo('None');
                
                // Fetch owner details using `fetchOwnerById` with `user.sub`
                try {
                    const ownerData = await fetchOwnerById(user.sub);
                    console.log('Owner Data:', ownerData);
                    
                    // Set the franchise ID from the owner data if available
                    if (ownerData?.franchiseID) {
                        setFranchise(ownerData.franchiseID);
                    }
                } catch (error) {
                    console.error('Error fetching owner data:', error);
                }
            } else {
                console.log('Not an Owner');
                setCbo(user?.sub || ''); // Default to empty string if `sub` is not defined
                try {
                    const cboData = await fetchCBOById(user.sub);
                    console.log('CBO Data:', cboData);
                    
                    // Set the franchise ID from the owner data if available
                    if (cboData?.franchiseID) {
                        setFranchise(cboData.franchiseID);
                    }
                } catch (error) {
                    console.error('Error fetching owner data:', error);
                }
            }
        };

        initializeCboAndFranchise();
    }, [user, ownerStatus]);

    // Fetch building data on mount
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-green-600 mb-6">Start a New Quote</h1>
                <QuoteDetails buildingData={buildingData} cbo={cbo} franchise={franchise} />
            </div>
        </div>
    );
};

export default MemberStartQuotePage;
