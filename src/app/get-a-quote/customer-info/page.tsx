'use client';
import React, { useEffect, useState } from 'react';
import CustomerInfo from "@/components/pages/CustomerInfo";
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';

function CustomerInfoPage() {
  const [buildingData, setBuildingData] = useState([]);
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCBOBuildingTypes();
                setBuildingData(data);
            } catch (error) {
                console.error('Error fetching building data:', error);
            }
        };
        fetchData();
    }, []);
  return (
    <div className="bg-gray-100 flex w-full flex-col min-h-screen">
      <Header />

      

      <div className="pt-32 pb-2">
        <CustomerInfo buildingData={buildingData}/>
      </div>
      
      <Footer />
    </div>
  );
}

export default CustomerInfoPage;
