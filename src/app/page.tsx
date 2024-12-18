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
        <main className="flex-grow pt-20">
          <UnderConstruction />
        </main>
        <footer className="text-white">
          <Footer />
        </footer>
      </div>
    </Suspense>
  );
}
