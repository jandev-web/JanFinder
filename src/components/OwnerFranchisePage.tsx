'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import deleteFranchise from '@/utils/deleteFranchise'

interface OwnerFranchisePageProps {
    user: any;
    franchise: any;
}

const OwnerFranchisePage: React.FC<OwnerFranchisePageProps> = ({ user, franchise }) => {
    const router = useRouter();
    
    const ownerID = user?.OwnerID
    const handleDelete = async () => {
        const confirmed = confirm('Are you sure you want to delete this franchise?');
        if (confirmed) {
            try {
                // Simulate API call for deletion
                deleteFranchise(ownerID)
                //alert('Franchise deleted successfully.');
                router.push('/members/logging-out');
            } catch (error) {
                alert('Failed to delete franchise. Please try again later.');
            }
        }
    };

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4 text-center">
                {/* Franchise Name */}
                <h2 className="text-4xl font-bold text-[#001F54] mb-6">{franchise?.name}</h2>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                >
                    Delete Franchise
                </button>
            </div>
        </div>
    );
};

export default OwnerFranchisePage;
