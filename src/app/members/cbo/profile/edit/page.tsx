import React from 'react';
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import EditProfileComponent from '@/components/pages/EditProfileComponent';
import CBOHeader from '@/components/CBOHeader';
import Link from 'next/link';

export const dynamic = "force-dynamic";


export default async function ProfilePage() {
  // Fetch user data server-side
  const user = await AuthGetCurrentUserServer();

  if (!user) {
    return <div>User not authenticated</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full pb-12">
        <CBOHeader user={user} />
      </div>

      {/* Back to Profile Button */}
      <div className="w-full flex justify-start mt-6 ml-6 mb-0 pb-0">
        <Link href="/members/cbo/profile">
          <a className="text-green-600 hover:text-yellow-400 transition">
            &lt; Back to Profile
          </a>
        </Link>
      </div>

      {/* Edit Profile Section */}
      <EditProfileComponent user={user} />
    </div>
  );
}
