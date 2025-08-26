'use client'
import React, { useState, useEffect } from 'react';
import FranchiseDayEventList from '@/components/franchiseDailyEvents';
import fetchOwnerById from '@/utils/getOwnerById';
import getFranchiseDayEvents from '@/utils/getDaysEventsFranchise';
import getRecentQuotes from '@/utils/getRecentQuotes'
import RecentQuotesList from '@/components/RecentQuotesList'
import LoadingSpinner from '@/components/loadingScreen'
import Image from 'next/image';

interface OwnerComponentProps {
  user: any;
}

const OwnerComponent: React.FC<OwnerComponentProps> = ({ user }) => {
  console.log(user)
  const [recentQuotes, setRecentQuoteInfo] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  
  return (
    <div className="relative pt-16 items-center justify-center min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      
      {/* Welcome Banner with full width and height */}
      <div className="relative z-10 bg-[#001F54] bg-opacity-80 w-full flex flex-col justify-center items-center p-12">
        <h1 className="text-center text-5xl font-extrabold tracking-wide text-white font-sans">
          Welcome to the Franchise Owner Homepage, {user?.firstName}!
        </h1>
      </div>
      <div className="relative z-10 h-[2px] bg-yellow-500 w-full "></div>

    

        
     
      
      
    </div>
  );
};

export default OwnerComponent;
