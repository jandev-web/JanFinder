'use client';

import React, { useEffect, useState } from 'react';
import getFranchiseInfo from '@/utils/getFranchiseInfo'
import getProfilePic from '@/utils/getProfilePic'
import Image from 'next/image'; 

interface Address {
  city: string;
  country: string;
  postalCode: string;
  state: string;
  street: string;
}

interface CBO {
  franchiseID: string;
  email: string;
  firstName: string;
  lastName: string;
  CBOID: string;
  address: Address;
  phone: string;
}

interface CheckProfilePageProps {
  cbo: CBO;
}

const CheckProfilePage: React.FC<CheckProfilePageProps> = ({ cbo }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [franchiseName, setFranchiseName] = useState('Loading...');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCBOData = async () => {
      if (cbo) {
        try {

          if (cbo.franchiseID) {

            const franInfo = await getFranchiseInfo(cbo.franchiseID)
            setFranchiseName(franInfo.franchiseName)
            const fetchedPic = await getProfilePic(cbo.CBOID);
            console.log(fetchedPic)
            if (fetchedPic) {
              // Assuming fetchedPic.body is a base64 encoded image
              console.log('FetchedPic: ', fetchedPic)
              setProfilePic(fetchedPic);
            }
          } else {
            console.error('Error fetching Franchise data')
          }
        } catch (error) {
          console.error('Error fetching CBO data:', error);
          setError('Error loading CBO information');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCBOData();
  }, [cbo]);
  return (

    <div className="bg-white p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        CBO Profile
      </h2>
      <div className="flex justify-center mb-6">
        {profilePic ? (
          <Image
            src={profilePic}
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full border-2 border-gray-300 shadow-lg"
            priority
          />
        ) : (
          <p className="text-gray-500">No profile picture available.</p>
        )}
      </div>
      <div className="space-y-4 text-center">
        <p className="text-xl text-gray-700">
          <strong>First Name:</strong> {cbo.firstName}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Last Name:</strong> {cbo.lastName}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Phone:</strong> {cbo.phone}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Email:</strong> {cbo.email}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Address:</strong> {cbo.address.street}, {cbo.address.city} {cbo.address.state}, {cbo.address.postalCode}
        </p>
        <p className="text-xl text-gray-700">
          <strong>Franchise:</strong> {franchiseName}
        </p>
      </div>
    </div>

  );
};

export default CheckProfilePage;
