'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loadingScreen'
import fetchAllCBOs from '@/utils/getAllCBOs'
import CBOCard from '@/components/CBOCard'
interface CBO {
    franchiseID: string; // Adjust based on your data structure
    franchiseName: string;
    CBOID: string;
    // Add other properties as needed
}

interface UserProps {
    user: any;
}

const AllCBOs: React.FC<UserProps> = ({ user }) => {
    //console.log('AllCBOs.tsx')
    //console.log(user?.signInDetails?.loginId)
    const id = user?.OwnerID
    //console.log('Email: ', user)
    const [cbos, setCBOs] = useState<CBO[]>([]);
    const [loading, setLoading] = useState(true);
    //const email = user.signInDetails.loginId
    const router = useRouter();
    //const ownerID = user.signInDetails.loginId

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const data = await fetchAllCBOs(id);
                    setCBOs(data || []);
                }
            } catch (error) {
                console.error('Error fetching CBO data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    const handleClick = (cbo: CBO) => {
        //console.log('CBO:')
        //console.log(cbo.franchiseID)
        router.push(`/members/owner/single-cbo?cboID=${cbo.CBOID}`);
    };

    const handleAddCBO = () => {
        router.push('/members/owner/cbos/add-cbo'); // Adjust the path to match your routing structure
    };

    //console.log('CBOs:')
    //console.log(cbos)
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold text-[#001F54]">List of Franchise Members</h1>
            {cbos.length === 0 ? (
                <div className="mt-4 text-gray-700">No Franchise Members found.</div>
            ) : (
                <ul className="space-y-4 mt-6">
                    {cbos.map((cbo) => (
                        <li key={cbo.CBOID}>
                            <CBOCard cbo={cbo} onClick={() => handleClick(cbo)} />
                        </li>
                    ))}
                </ul>
            )}
            <button
                onClick={handleAddCBO}
                className="mt-6 bg-yellow-500 text-[#001F54] font-bold py-2 px-4 rounded hover:bg-yellow-400 transition"
            >
                Add New CBO
            </button>
        </div>

    );
};


export default AllCBOs;
