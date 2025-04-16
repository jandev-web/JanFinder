'use client'


import Header from "@/components/Header";

import Packages from "@/components/pages/Packages";
import Footer from '@/components/Footer';

function PackagesPage() {
  
  return (
    <div className="flex flex-col w-full min-h-screen">
      
        <Header />
      
      

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-8 pb-2">
      <Packages />
      </div>
      
        <Footer />
      

    </div>
  );
}

export default PackagesPage;