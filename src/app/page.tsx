"use client";

import React, { useEffect, Suspense } from 'react';
import { LandingPage } from "../components/index";

// Amplify.configure(awsExports);

export default function Page() {

  return (
    
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPage />
    </Suspense>
  );
}
