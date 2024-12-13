
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@aws-amplify/ui-react/styles.css'; // Ensure the styles are imported
import CBO from '@/components/pages/CBO';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';

import { AuthGetCurrentUserServer, cookiesClient } from "@/utils/amplify-utils";




export default async function MembersPage() {
  try {
    // Retrieve cookies for SSR
    

    // Fetch the current user from Amplify
    const user = await AuthGetCurrentUserServer();
    console.log(user)
    // Determine user role and render appropriate component
    if (!user) {
      return<div>No</div>
    }
    if (user && user.attributes['custom:isOwner'] === 'true') {
      return <div>Hello</div>
    }

    if (user && user.attributes['custom:isOwner'] === 'false') {
      return <div>There</div>
    }

    // Render loading screen if user data is incomplete
    return <MemberLoadingScreen />;
  } catch (error) {
    console.error('Error fetching authenticated user:', error);

    // Redirect or show an error message if fetching user fails
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error fetching your account information. Please <a href="/members/sign-in">sign in</a> again.</p>
      </div>
    );
  }
}
