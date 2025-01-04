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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.OwnerID) {
        try {
          const recentQuoteData = await getRecentQuotes(user.OwnerID)
          setRecentQuoteInfo(recentQuoteData)
          if (user.franchiseID) {
            const franchiseEvents = await getFranchiseDayEvents(user.franchiseID);
            console.log(franchiseEvents)
            setEvents(franchiseEvents);
          }
        } catch (error) {
          console.error('Error fetching owner or events:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="relative pt-16 items-center justify-center min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/images/OwnerHomePic.jpeg"
          alt="Owner Home Background"
          layout="fill"
          objectFit="cover"
          quality={80}
        />
      </div>

      {/* Welcome Banner with full width and height */}
      <div className="relative z-10 bg-[#001F54] bg-opacity-80 w-full flex flex-col justify-center items-center p-12">
        <h1 className="text-center text-5xl font-extrabold tracking-wide text-white font-sans">
          Welcome to the Franchise Owner Homepage, {user?.firstName}!
        </h1>
      </div>
      <div className="relative z-10 h-[2px] bg-yellow-500 w-full "></div>

      {/* Statistics Section */}
      <div className="relative flex flex-col pt-12 pb-12 items-center justify-center">
      <div className="relative z-10 grid grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Recent Activity</p>
          <FranchiseDayEventList events={events} />
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Alerts</p>
        </div>

        {/* Top CBOs */}
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Top CBOs</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Revenue this Month</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Upcoming Events</p>
        </div>

        {/* Total Quotes */}
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Total Quotes</p>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Recent Quotes</p>
          <RecentQuotesList quotes={recentQuotes} />
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Created Quotes</p>
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default OwnerComponent;
