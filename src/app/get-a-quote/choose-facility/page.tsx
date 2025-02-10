'use client'

import { Header } from "../../../components";
import { Quote } from "../../../components";
import Footer from '@/components/Footer';
import QuoteProgressBar from "@/components/QuoteProgressBar";

function QuotePage() {
  
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div className="pt-32">
        <QuoteProgressBar stepNumber={2} />
      </div>
      
      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-18 pb-20 mb-0">
      <Quote />
      </div>
      <div className="pt-0 mt-0">
        <Footer />
      </div>

    </div>
  );
}

export default QuotePage;