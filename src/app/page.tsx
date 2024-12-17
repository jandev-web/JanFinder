"use client";

import React, { useEffect, Suspense } from 'react';
import UnderConstruction from "@/components/pages/UnderConstructionWhole";

// Amplify.configure(awsExports);

export default function Page() {

  return (
    
    <Suspense fallback={<div>Loading...</div>}>
      <UnderConstruction />
    </Suspense>
  );
}
