'use client';
import React from 'react';
import CustomerGetQuoteForm from "@/components/pages/CustomerGetQuoteForm";
import Header from "@/components/Header";
import Footer from '@/components/Footer';


function CustomerStartQuotePage() {
  
  return (
    <div className="bg-gray-100 flex w-full flex-col min-h-screen">
      <Header />

      

      <div className="pt-8 pb-2">
        <CustomerGetQuoteForm />
      </div>
      
      <Footer />
    </div>
  );
}

export default CustomerStartQuotePage;