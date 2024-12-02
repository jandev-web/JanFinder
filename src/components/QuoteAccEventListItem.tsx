'use client';

import React, { useState, useEffect } from 'react';
import fetchCBOById from '@/utils/getCBOByID'
import getQuoteDetails from '@/utils/getQuoteDetails'
interface Event {
  EventType: string;
  Timestamp: string;
  Quote: string;
  EventID: string;
  CBO: string;
  Franchise: string;
}

interface QuoteAccEventListItemProps {
  event: Event;
}

const QuoteAccEventListItem: React.FC<QuoteAccEventListItemProps> = ({ event }) => {
  const [cboInfo, setCBOInfo] = useState<any>(null);
  const [quoteInfo, setQuoteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      
        try {
          const cboData = await fetchCBOById(event.CBO);
          const quoteData = await getQuoteDetails(event.Quote)
          console.log(cboData)
          setCBOInfo(cboData);
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
      <p className="font-bold text-yellow-400">Quote Accepted</p>
      <p className="text-sm text-gray-600">{new Date(event.Timestamp).toLocaleString()}</p>
      <p className="text-sm text-gray-600">CBO:  {cboInfo?.firstName} {cboInfo?.lastName}</p>
      <p className="text-sm text-gray-600">Customer:  {quoteInfo?.customerData.firstName} {quoteInfo?.customerData.lastName}</p>
      <p className="text-sm text-gray-600">Price:  ${quoteInfo?.Package.cost}</p>

    </li>
  );
};

export default QuoteAccEventListItem;
