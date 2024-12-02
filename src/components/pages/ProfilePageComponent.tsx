'use client';

import React, { useState, useEffect } from 'react';
import fetchCBOById from '@/utils/getCBOByID';
import LoadingSpinner from '@/components/loadingScreen'
import getProfilePic from '@/utils/getProfilePic';
import Image from 'next/image';
interface ProfilePageProps {
  user: any;
}

const ProfilePageComponent: React.FC<ProfilePageProps> = ({ user }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.sub) {
        try {
          const fetchedData = await fetchCBOById(user.sub);
          setUserInfo(fetchedData);

          // Fetch the profile picture
          const fetchedPic = await getProfilePic(user.sub);
          console.log(fetchedPic)
          if (fetchedPic) {
            // Assuming fetchedPic.body is a base64 encoded image
            console.log('FetchedPic: ', fetchedPic)
            setProfilePic(fetchedPic);
          }
        } catch (err) {
          console.error('Failed to fetch user info or profile picture', err);
          setError('Failed to fetch user info or profile picture');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);



  if (loading) return (
    <div className="pt-8">
      <LoadingSpinner />
    </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center  min-h-screen bg-gray-100 pt-0 mt-20 pb-0 mb-0">
      {user && (
        <h2 className="text-2xl font-bold text-gray-800 mt-0 pt-0 mb-6">
          Welcome to the Profile Page, {userInfo?.firstName} {userInfo?.lastName}!
        </h2>
      )}
      {userInfo && (
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Information:</h3>

          {/* Display profile picture */}
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

          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>First Name:</strong> {userInfo.firstName}
            </p>
            <p className="text-gray-700">
              <strong>Last Name:</strong> {userInfo.lastName}
            </p>

            <p className="text-gray-700">
              <strong>Email:</strong> {userInfo.email}
            </p>
          </div>

          {/* Edit Info Button */}
          <div className="mt-6 flex justify-center">
            <a
              href="/members/cbo/profile/edit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-300 hover:text-green-500 transition"
            >
              Edit Info
            </a>
          </div>
        </div>
      )}
    </div>
  );


};

export default ProfilePageComponent;
