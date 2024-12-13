import React from 'react';
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import ProfilePageComponent from '@/components/pages/ProfilePageComponent';
import CBOHeader from '@/components/CBOHeader';

interface ProfilePageProps {
  user: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  if (!user) {
    return <div>No user found. Please log in.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      <div className="w-full pb-12">
        <CBOHeader user={user} />
      </div>
      <ProfilePageComponent user={user} />
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const user = await AuthGetCurrentUserServer();

    // If no user is found, redirect to login
    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: { user },
    };
  } catch (error) {
    console.error('Error fetching user:', error);

    // Redirect to login on error
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}

export default ProfilePage;
