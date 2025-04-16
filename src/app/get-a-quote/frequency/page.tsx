'use client'


import Header from "@/components/Header";

import SetQuoteFrequency from "@/components/SetQuoteFrequency";
import Footer from '@/components/Footer';

function FrequencyPage() {

  return (
    <div className="bg-gray-100 flex flex-col w-full min-h-screen">

      <Header />



      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-8 pb-2">
        <SetQuoteFrequency />
      </div>

      <Footer />


    </div>
  );
}

export default FrequencyPage;