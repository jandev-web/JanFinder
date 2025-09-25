import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { QuoteCard } from './QuoteCard';
import { QuoteDetailSheet } from './QuoteDetailSheet';
import { useBiddingStore } from '../../state/bidding.store';
import { Quote, GroupedQuotes } from './types';
import { getTimeGroup } from '../../utils/ranking';
import { Clock, DollarSign, TrendingUp, Award } from 'lucide-react';

interface BiddingPlatformProps {
  availableQuotes: any;
}

export const OwnerBiddingBoard: React.FC<BiddingPlatformProps> = ({ availableQuotes }) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('open');

  console.log(availableQuotes)
  const { 
    currentProvider,
    fetchQuotes,
    myStanding,
    myBidForQuote,
    loading
  } = useBiddingStore();

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Group quotes by time remaining
  const groupQuotesByTime = (quotes: any[]): GroupedQuotes => {
    const grouped: GroupedQuotes = {
      '5min': [],
      '1hour': [],
      '24hour': [],
      'later': []
    };

    quotes.forEach(quote => {
      const group = getTimeGroup(quote.confirmationTimestamp);
      grouped[group].push(quote);
    });

    return grouped;
  };

  const groupedQuotes = groupQuotesByTime(availableQuotes);

  // Mock data for other tabs
  const myBids = availableQuotes.filter((q: any) => myBidForQuote(q.id));
  const wonQuotes = []; // Mock - would come from backend
  const lostQuotes = []; // Mock - would come from backend

  const handleOpenQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setSheetOpen(true);
  };

  const renderQuoteGroup = (title: string, quotes: any[], icon: React.ReactNode) => {
    if (quotes.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="sticky top-0 bg-background z-10 py-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            {icon}
            {title} ({quotes.length})
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map(quote => {
            const standing = myStanding(quote.QuoteID);
            return (
              <QuoteCard
                key={quote.QuoteID}
                quote={quote}
                standing={standing.rank > 0 ? standing : undefined}
                credits={currentProvider?.credits}
                winRate={currentProvider?.winRate}
                onOpen={() => handleOpenQuote(quote)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderEmptyState = (message: string, description: string) => (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Bidding Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Compete for cleaning contracts in your region
          </p>
        </div>
        
        {currentProvider && (
          <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-base text-gray-900">{currentProvider.credits}</div>
                <div className="text-gray-500 text-xs">Credits</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-base text-gray-900">{Math.round(currentProvider.winRate * 100)}%</div>
                <div className="text-gray-500 text-xs">Win Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 h-auto rounded-md">
          <TabsTrigger 
            value="open" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2 text-sm font-medium rounded-sm"
          >
            Open ({availableQuotes.length})
          </TabsTrigger>
          <TabsTrigger 
            value="my-bids"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2 text-sm font-medium rounded-sm"
          >
            My Bids ({myBids.length})
          </TabsTrigger>
          <TabsTrigger 
            value="won"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2 text-sm font-medium rounded-sm"
          >
            Won ({wonQuotes.length})
          </TabsTrigger>
          <TabsTrigger 
            value="lost"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2 text-sm font-medium rounded-sm"
          >
            Lost ({lostQuotes.length})
          </TabsTrigger>
        </TabsList>

        {/* Open Quotes Tab */}
        <TabsContent value="open" className="space-y-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading quotes...</div>
          ) : availableQuotes.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
              <div className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-base font-medium mb-2 text-gray-900">No Open Quotes</h3>
              <p className="text-gray-600 text-sm">No open quotes in your region. Try expanding your radius or check back soon.</p>
            </div>
          ) : (
            <>
              {renderQuoteGroup(
                "Expires in 5 Minutes", 
                groupedQuotes['5min'], 
                <Clock className="h-4 w-4 text-red-600" />
              )}
              {renderQuoteGroup(
                "Expires in 1 Hour", 
                groupedQuotes['1hour'], 
                <Clock className="h-4 w-4 text-orange-600" />
              )}
              {renderQuoteGroup(
                "Expires in 24 Hours", 
                groupedQuotes['24hour'], 
                <Clock className="h-4 w-4 text-gray-500" />
              )}
              {renderQuoteGroup(
                "Later", 
                groupedQuotes['later'], 
                <Clock className="h-4 w-4 text-gray-500" />
              )}
            </>
          )}
        </TabsContent>

        {/* My Bids Tab */}
        <TabsContent value="my-bids" className="space-y-6">
          {myBids.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
              <div className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-base font-medium mb-2 text-gray-900">No Active Bids</h3>
              <p className="text-gray-600 text-sm">You haven't placed any bids yet. Browse open quotes to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myBids.map((quote: any) => {
                const standing = myStanding(quote.id);
                return (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    standing={standing}
                    credits={currentProvider?.credits}
                    winRate={currentProvider?.winRate}
                    onOpen={() => handleOpenQuote(quote)}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Won Tab */}
        <TabsContent value="won">
          <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
            <div className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-base font-medium mb-2 text-gray-900">No Won Contracts</h3>
            <p className="text-gray-600 text-sm">Your won contracts will appear here. Keep bidding to win your first contract!</p>
          </div>
        </TabsContent>

        {/* Lost Tab */}
        <TabsContent value="lost">
          <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
            <div className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-base font-medium mb-2 text-gray-900">No Lost Bids</h3>
            <p className="text-gray-600 text-sm">Your unsuccessful bids will appear here for review and learning.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quote Detail Sheet */}
      <QuoteDetailSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        quote={selectedQuote}
      />
    </div>
  );
};