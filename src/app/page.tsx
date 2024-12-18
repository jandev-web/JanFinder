"use client";

import React, { Suspense } from "react";
import UnderConstruction from "@/components/pages/UnderConstructionWhole";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col w-full min-h-screen">
        <Header />
        <div className="flex-grow pt-26">
          <UnderConstruction />
        </div> {/* Correctly closed */}
        <div className="pt-0 mt-0">
          <Footer />
        </div>
      </div> {/* Correctly closed */}
    </Suspense>
  );
}
