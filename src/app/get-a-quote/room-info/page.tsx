'use client'


import Header from "@/components/Header";
import CustomerAddRooms from "@/components/pages/CustomerAddRoomsPage";
import Footer from '@/components/Footer';

function RoomInfoPage() {
  
  return (
    <div className="bg-gray-100 flex w-full flex-col min-h-screen">
      
        <Header />
      

      {/* Ensures Home takes up all available space between Header and Footer */}
      <div className="flex-grow pt-8 pb-2">
      <CustomerAddRooms />
      </div>
      
        <Footer />
      

    </div>
  );
}

export default RoomInfoPage;