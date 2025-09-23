import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { LeaderboardCompact } from './LeaderboardCompact';
import { ProviderBadge } from './ProviderBadge';
import { Countdown } from './Countdown';
import { useBiddingStore } from '../../state/bidding.store';
import { Quote, CustomerDecision } from './types';
import { formatCurrency } from '../../utils/validation';
import { useToast } from '../../hooks/use-toast';
import { Clock, CheckCircle, Users, DollarSign } from 'lucide-react';

interface CustomerBidsViewProps {
  quoteId: string;
}

export const CustomerBidsView: React.FC<CustomerBidsViewProps> = ({ quoteId }) => {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    quotes,
    providers,
    bidsByQuote,
    top3ByQuote,
    customerDecisions,
    setCustomerDecision,
    fetchQuotes,
    fetchBids
  } = useBiddingStore();

  useEffect(() => {
    fetchQuotes();
    fetchBids(quoteId);
  }, [quoteId, fetchQuotes, fetchBids]);

  const quote = quotes.find(q => q.id === quoteId);
  const bids = bidsByQuote(quoteId);
  const top3 = top3ByQuote(quoteId);
  const existingDecision = customerDecisions.find(d => d.quoteId === quoteId);

  const handleExpire = () => {
    if (!hasExpired && !existingDecision) {
      setHasExpired(true);
      // Auto-award to lowest bid
      if (top3.length > 0) {
        setWinner(top3[0].providerId);
      }
    }
  };

  const handleCustomerOverride = async (providerId: string) => {
    const selectedBid = bids.find(b => b.providerId === providerId);
    if (!selectedBid) return;

    try {
      const decision: CustomerDecision = {
        quoteId,
        mode: 'CUSTOMER_OVERRIDE',
        chosenBidId: selectedBid.id,
        decidedAt: new Date()
      };

      await setCustomerDecision(decision);
      setWinner(providerId);
      setShowOverrideModal(false);
      
      toast({
        title: "Provider Selected",
        description: "You have successfully selected your preferred provider.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select provider. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!quote) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Quote not found</p>
        </CardContent>
      </Card>
    );
  }

  const isExpired = hasExpired || new Date() > quote.expiresAt;
  const finalWinner = winner || (existingDecision?.mode === 'CUSTOMER_OVERRIDE' && existingDecision.chosenBidId ? 
    bids.find(b => b.id === existingDecision.chosenBidId)?.providerId : 
    (isExpired && top3.length > 0 ? top3[0].providerId : null));

  const winningProvider = finalWinner ? providers.find(p => p.id === finalWinner) : null;
  const winningBid = finalWinner ? bids.find(b => b.providerId === finalWinner) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{quote.title}</span>
            <Badge variant="outline" className="text-sm">
              {formatCurrency(quote.baselinePrice)} baseline
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {bids.length} bid{bids.length !== 1 ? 's' : ''} received
              </div>
              {!isExpired && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <Countdown expiresAt={quote.expiresAt} onExpire={handleExpire} />
                </div>
              )}
            </div>

            {!isExpired && top3.length > 0 && (
              <Dialog open={showOverrideModal} onOpenChange={setShowOverrideModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Choose Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Your Provider</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Select your preferred provider from the top 3 bids. The lowest bid will be 
                      auto-selected if you don't choose before the deadline.
                    </p>
                    
                    {top3.map((bid, index) => {
                      const provider = providers.find(p => p.id === bid.providerId);
                      if (!provider) return null;

                      return (
                        <Card 
                          key={bid.id} 
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleCustomerOverride(provider.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <ProviderBadge provider={provider} />
                              <div className="text-right">
                                <div className="font-medium">{formatCurrency(bid.amount)}</div>
                                {index === 0 && (
                                  <Badge variant="default" className="text-xs mt-1">
                                    Lowest
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {isExpired ? (
              "Bidding has closed. Winner has been determined."
            ) : (
              "Lowest bid will be auto-selected at close. You may pick a different provider now or after close."
            )}
          </div>
        </CardContent>
      </Card>

      {/* Winner Panel */}
      {finalWinner && winningProvider && winningBid && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              {existingDecision?.mode === 'CUSTOMER_OVERRIDE' ? 'Your Selected Provider' : 'Winning Bid'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <ProviderBadge provider={winningProvider} />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">
                  {formatCurrency(winningBid.amount)}
                </div>
                <div className="text-sm text-gray-500">
                  Final Price
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• The provider will contact you within 24 hours</li>
                <li>• Schedule a walkthrough of your facility</li>
                <li>• Finalize service agreement and start date</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bids Leaderboard */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {isExpired ? 'Final Results' : 'Current Bids'}
        </h3>
        <LeaderboardCompact
          bids={bids}
          providers={providers}
          baselinePrice={quote.baselinePrice}
          showPrices={isExpired || existingDecision?.mode === 'CUSTOMER_OVERRIDE'}
        />
      </div>

      {/* Quote Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Square Footage:</span>
              <div className="font-medium">{quote.sqft.toLocaleString()} sq ft</div>
            </div>
            <div>
              <span className="text-gray-500">Frequency:</span>
              <div className="font-medium">{quote.frequency}</div>
            </div>
          </div>

          <div>
            <span className="text-gray-500 text-sm">Required Tasks:</span>
            <ul className="mt-2 space-y-1">
              {quote.tasks.map((task, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};