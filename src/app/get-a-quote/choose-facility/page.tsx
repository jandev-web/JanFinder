'use client'

import { Header } from "../../../components";
import { Quote } from "../../../components";
import Footer from '@/components/Footer';

function QuotePage() {
  
  return (
    <div className="bg-gray-100 flex w-full flex-col min-h-screen">
      <Header />

      

      <div className="pt-8 pb-2">
        <Quote />
      </div>
      
      <Footer />
    </div>
  );
}

export default QuotePage;