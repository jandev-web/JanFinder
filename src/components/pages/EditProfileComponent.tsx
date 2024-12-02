'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import fetchCBOById from '@/utils/getCBOByID';
import uploadPic from '@/utils/uploadProfilePic';
import updateCBOInfo from '@/utils/updateMemberInfo'; // Utility to update user info
import getProfilePic from '@/utils/getProfilePic';
import Image from 'next/image';

interface EditProfileProps {
  user: any;
}

const EditProfileComponent: React.FC<EditProfileProps> = ({ user }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [franchiseName, setFranchise] = useState('');
  const [newPic, setNewPic] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.sub) {
        try {
          const fetchedData = await fetchCBOById(user.sub);
          setUserInfo(fetchedData);
          setFirstName(fetchedData.firstName);
          setLastName(fetchedData.lastName);
          setEmail(fetchedData.email);
          setFranchise(fetchedData.franchiseName);

          // Fetch the profile picture
          const fetchedPic = await getProfilePic(user.sub);
          if (fetchedPic) {
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

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
      setNewPic(true);
    }
  };

  // Handle info update
  const handleUpdateInfo = async () => {
    if (userInfo && user?.sub) {
      try {
        if (newPic && selectedFile) {
          try {
            setUploadStatus('Uploading...');
            await uploadPic(user.sub, selectedFile);
            setUploadStatus('Upload successful!');
          } catch (err) {
            console.error('Failed to upload picture', err);
            setUploadStatus('Upload failed.');
          }
        }
        await updateCBOInfo(user.sub, { firstName, lastName, franchiseName });
        alert('Info updated successfully!');
        router.push('/members/cbo/profile');
      } catch (err) {
        console.error('Failed to update user info', err);
        setError('Failed to update user info');
      }
    }
  };

  // Check if any changes have been made
  const hasChanges = () => {
    return (
      firstName !== userInfo?.firstName ||
      lastName !== userInfo?.lastName ||
      franchiseName !== userInfo?.franchiseName ||
      newPic
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {user && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Profile for {userInfo?.firstName} {userInfo?.lastName}
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
            <label className="block text-gray-700">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />

            <label className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Upload New Profile Picture</h4>
            <input type="file" onChange={handleFileChange} />
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>

          {/* Update Info Button */}
          {hasChanges() && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUpdateInfo}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Update Info
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditProfileComponent;
