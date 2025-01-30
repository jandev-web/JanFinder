'use client';

import React from 'react';
import QuoteAccEventListItem from '@/components/QuoteAccEventListItem';  // Import the new component
import NewQuoteEventListItem from '@/components/NewQuoteEventListItem';  // Import the new component

interface Event {
  EventType: string;
  Timestamp: string;
  Quote: string;
  EventID: string;
  CBO: string;
  Franchise: string;
}

interface ScrollableEventListProps {
  events: Event[];
}

const FranchiseDayEventList: React.FC<ScrollableEventListProps> = ({ events }) => {
  // Sort events by timestamp, newest first

  const sortedEvents = events.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-h-80 w-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-green-600">Today&apos;s Events</h2>
      {sortedEvents.length === 0 ? (
        <p className="text-gray-500">No events for today</p>
      ) : (
        <ul>
          {sortedEvents.map((event) => (
            <React.Fragment key={event.EventID}>
              {event.EventType === 'acceptedQuote' ? (
                <QuoteAccEventListItem event={event} />
              ) : event.EventType === 'quoteCreated' ? (
                <NewQuoteEventListItem event={event} />
              ) : (
                <li className="mb-4 border-b pb-2">
                  <p className="font-bold text-red-500">Unknown Event Type</p>
                  <p className="text-sm text-gray-600">Timestamp: {new Date(event.Timestamp).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Qute ID: {event.Quote}</p>
                  <p className="text-sm text-gray-600">CBO: {event.CBO}</p>
                  <p className="text-sm text-gray-600">Franchise: {event.Franchise}</p>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FranchiseDayEventList;
