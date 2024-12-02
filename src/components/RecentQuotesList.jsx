'use client';

import React from 'react';
import RecentQuoteListItem from './RecentQuoteListItem';

const RecentQuoteList = ({ quotes }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-h-80 w-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-green-500">Recent Quotes</h2>
      {quotes.length === 0 ? (
        <p className="text-gray-500">No recent quotes available</p>
      ) : (
        <ul>
          {quotes.map((quote) => (
            <li key={quote.QuoteID} className="mb-4">
              <RecentQuoteListItem quote={quote} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentQuoteList;
