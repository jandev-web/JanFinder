'use client';

import React, { useState, useEffect } from 'react';

import getQuoteDetails from '@/utils/getQuoteDetails'
interface Event {
  EventType: string;
  Timestamp: string;
  Quote: string;
  EventID: string;
  CBO: string;
  Franchise: string;
}

interface NewQuoteListItemProps {
  event: Event;
}

const NewQuoteEventListItem: React.FC<NewQuoteListItemProps> = ({ event }) => {
  
  const [quoteInfo, setQuoteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      
        try {
          
          const quoteData = await getQuoteDetails(event.Quote)
          setQuoteInfo(quoteData)
        } catch (error) {
          console.error('Error fetching owner or events:', error);
        } finally {
          setLoading(false);
        }
      
    };
    fetchData();
  }, [event]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <li className="mb-4 border-b pb-2">
      <p className="font-bold text-green-500">New Quote!</p>
      <p className="text-sm text-gray-600">{new Date(event.Timestamp).toLocaleString()}</p>
      <p className="text-sm text-gray-600">Customer:  {quoteInfo.customerData.firstName} {quoteInfo.customerData.lastName}</p>
      <p className="text-sm text-gray-600">Price:  ${quoteInfo.Package.cost}</p>

    </li>
  );
};

export default NewQuoteEventListItem;
