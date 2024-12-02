'use client';
import { CustomerInfo } from "../../components";
import { Header } from "../../components";
import Footer from '@/components/Footer';

function CustomerInfoPage() {
  return (
    <div className="bg-gray-100 flex w-full flex-col min-h-screen">
      <Header />

      

      <div className="pt-32 pb-2">
        <CustomerInfo />
      </div>
      
      <Footer />
    </div>
  );
}

export default CustomerInfoPage;
