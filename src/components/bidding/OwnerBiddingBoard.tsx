import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { QuoteCard } from './QuoteCard';
import { QuoteDetailSheet } from './QuoteDetailSheet';
import { useBiddingStore } from '../../state/bidding.store';
import { Quote, GroupedQuotes } from './types';
import { getTimeGroup } from '../../utils/ranking';
import { Clock, DollarSign, TrendingUp, Award } from 'lucide-react';

export const OwnerBiddingBoard: React.FC = () => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('open');

  const { 
    quotes, 
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
  const groupQuotesByTime = (quotes: Quote[]): GroupedQuotes => {
    const grouped: GroupedQuotes = {
      '5min': [],
      '1hour': [],
      '24hour': [],
      'later': []
    };

    quotes.forEach(quote => {
      const group = getTimeGroup(quote.expiresAt);
      grouped[group].push(quote);
    });

    return grouped;
  };

  const openQuotes = quotes.filter(q => q.status === 'OPEN');
  const groupedQuotes = groupQuotesByTime(openQuotes);

  // Mock data for other tabs
  const myBids = openQuotes.filter(q => myBidForQuote(q.id));
  const wonQuotes = []; // Mock - would come from backend
  const lostQuotes = []; // Mock - would come from backend

  const handleOpenQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setSheetOpen(true);
  };

  const renderQuoteGroup = (title: string, quotes: Quote[], icon: React.ReactNode) => {
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
            const standing = myStanding(quote.id);
            return (
              <QuoteCard
                key={quote.id}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bidding Dashboard</h1>
          <p className="text-gray-500">
            Compete for cleaning contracts in your region
          </p>
        </div>
        
        {currentProvider && (
          <Card className="p-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{currentProvider.credits}</div>
                <div className="text-gray-500">Credits</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{Math.round(currentProvider.winRate * 100)}%</div>
                <div className="text-gray-500">Win Rate</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="open">Open ({openQuotes.length})</TabsTrigger>
          <TabsTrigger value="my-bids">My Bids ({myBids.length})</TabsTrigger>
          <TabsTrigger value="won">Won ({wonQuotes.length})</TabsTrigger>
          <TabsTrigger value="lost">Lost ({lostQuotes.length})</TabsTrigger>
        </TabsList>

        {/* Open Quotes Tab */}
        <TabsContent value="open" className="space-y-6">
          {loading ? (
            <div className="text-center py-8">Loading quotes...</div>
          ) : openQuotes.length === 0 ? (
            renderEmptyState(
              "No Open Quotes",
              "No open quotes in your region. Try expanding your radius or check back soon."
            )
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
            renderEmptyState(
              "No Active Bids",
              "You haven't placed any bids yet. Browse open quotes to get started."
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myBids.map(quote => {
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
          {renderEmptyState(
            "No Won Contracts",
            "Your won contracts will appear here. Keep bidding to win your first contract!"
          )}
        </TabsContent>

        {/* Lost Tab */}
        <TabsContent value="lost">
          {renderEmptyState(
            "No Lost Bids",
            "Your unsuccessful bids will appear here for review and learning."
          )}
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