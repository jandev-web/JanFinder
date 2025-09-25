//src/app/page.tsx
"use client";

import React, { useEffect, Suspense } from 'react';
import LandingPage from "../components/pages/LandingPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// Amplify.configure(awsExports);

export default function Page() {

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Suspense fallback={<div>Loading...</div>}>
        <LandingPage />
      </Suspense>
    </TooltipProvider>
  );
}
