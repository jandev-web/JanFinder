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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#001F54] to-[#003a85] text-white p-6 space-y-10">
      {/* Welcome Banner */}
      <div className="w-full py-6 px-10 text-center bg-yellow-400 text-[#001F54] rounded-lg shadow-lg">
        {user && <h2 className="text-3xl font-extrabold">Welcome to the Owner Homepage, {user?.firstName}!</h2>}
      </div>

  

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Recent Activity</p>
          <FranchiseDayEventList events={events} />
        </div>

        {/* Top CBOs */}
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center text-[#001F54] hover:shadow-yellow-500 transition-all">
          <p className="text-2xl font-bold">Top CBOs</p>
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
      </div>
    </div>
  );
};

export default OwnerComponent;
