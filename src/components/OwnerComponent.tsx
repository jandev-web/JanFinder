'use client'
import React, { useState, useEffect } from 'react';
import FranchiseDayEventList from '@/components/franchiseDailyEvents';
import fetchOwnerById from '@/utils/getOwnerById';
import getFranchiseDayEvents from '@/utils/getDaysEventsFranchise';
import getRecentQuotes from '@/utils/getRecentQuotes'
import RecentQuotesList from '@/components/RecentQuotesList'
import LoadingSpinner from '@/components/loadingScreen'
interface OwnerComponentProps {
  user: any;
}

const OwnerComponent: React.FC<OwnerComponentProps> = ({ user }) => {
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [recentQuotes, setRecentQuoteInfo] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.sub) {
        try {
          const ownerData = await fetchOwnerById(user.sub);
          console.log(ownerData)
          setOwnerInfo(ownerData);
          const recentQuoteData = await getRecentQuotes(user.sub)
          setRecentQuoteInfo(recentQuoteData)
          if (ownerData.franchiseID) {
            const franchiseEvents = await getFranchiseDayEvents(ownerData.franchiseID);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="w-full text-green-500 py-6 px-10 text-center">
        {user && <h2 className="text-2xl font-semibold">Welcome to the Owner Homepage, {ownerInfo?.firstName}</h2>}
      </div>
      <div className="relative z-0 flex justify-center pb-8">
        <div className=" w-64 h-64 rounded-full p-1 bg-gradient-to-r from-green-700 via-yellow-400 to-yellow-200 animate-spin-slow">
          <div className="w-full h-full bg-gray-100 p-1 rounded-full animate-reverse-spin-slow">
            <img
              src="/images/OwnerClipboard.jpeg"
              alt="Cleaning janitor"
              className="w-full h-full object-cover rounded-full shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition-all">
          <p className="text-xl font-semibold text-gray-700">Recent Activity</p>
          <FranchiseDayEventList events={events} />
        </div>

        {/* Top CBOs */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition-all">
          <p className="text-xl font-semibold text-gray-700">Top CBOs</p>
        </div>

        {/* Total Quotes */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition-all">
          <p className="text-xl font-semibold text-gray-700">Total Quotes</p>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition-all">
          <p className="text-xl font-semibold text-gray-700">Recent Quotes</p>
          <RecentQuotesList quotes={recentQuotes} />
        </div>
      </div>
    </div>
  );
};

export default OwnerComponent;
