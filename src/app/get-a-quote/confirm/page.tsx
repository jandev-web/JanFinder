'use client'


import Header from "@/components/Header";
import ConfirmPage from '@/components/pages/ConfirmQuote';
import Footer from '@/components/Footer';


function FinalQuotePage() {

  return (
    <div className="bg-gray-100 flex flex-col w-full min-h-screen">

      <Header />



      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-8 pb-2">
        <ConfirmPage />
      </div>

      <Footer />


    </div>
  );
}

export default FinalQuotePage;