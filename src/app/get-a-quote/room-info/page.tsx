'use client'


import Header from "@/components/Header";

import AddRoomsQuote from "@/components/AddRoomsQuote";
import Footer from '@/components/Footer';

function PackagesPage() {
  
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="pb-18">
        <Header />
      </div>

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-28 pb-0 mb-0">
      <AddRoomsQuote />
      </div>
      <div className="pt-0 mt-0">
        <Footer />
      </div>

    </div>
  );
}

export default PackagesPage;