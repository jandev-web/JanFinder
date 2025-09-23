import React, { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { BidPlaceForm } from './BidPlaceForm';
import { BidStatPills } from './BidStatPills';
import { Countdown } from './Countdown';
import { Quote } from './types';
import { useBiddingStore } from '../../state/bidding.store';
import { formatCurrency } from '../../utils/validation';
import { MapPin, Square, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuoteDetailSheetProps {
  open: boolean;
  onClose: () => void;
  quote: Quote | null;
}

export const QuoteDetailSheet: React.FC<QuoteDetailSheetProps> = ({ 
  open, 
  onClose, 
  quote 
}) => {
  const { 
    policy, 
    currentProvider,
    fetchBids,
    myStanding,
    myBidForQuote,
    loading
  } = useBiddingStore();

  useEffect(() => {
    if (quote && open) {
      fetchBids(quote.id);
    }
  }, [quote, open, fetchBids]);

  if (!quote || !currentProvider) return null;

  const standing = myStanding(quote.id);
  const existingBid = myBidForQuote(quote.id);
  const min = quote.baselinePrice * policy.minPct;
  const max = quote.baselinePrice * policy.maxPct;

  const handleBidSuccess = () => {
    // Refresh bids after successful submission
    fetchBids(quote.id);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto" side="right">
        <SheetHeader className="space-y-3">
          <div className="text-left space-y-2">
            <SheetTitle className="text-xl">{quote.title}</SheetTitle>
            <SheetDescription className="flex items-center gap-1 text-base">
              <MapPin className="h-4 w-4" />
              {quote.location}
            </SheetDescription>
          </div>
          
          <div className="flex items-center justify-between">
            <Countdown expiresAt={quote.expiresAt} className="text-base" />
            <Badge variant="outline" className="text-sm">
              Baseline: {formatCurrency(quote.baselinePrice)}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Summary Section */}
          <section>
            <h3 className="font-semibold mb-3">Quote Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-gray-500" />
                <span>{quote.sqft.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{quote.frequency}</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Tasks Section */}
          <section>
            <h3 className="font-semibold mb-3">Required Tasks</h3>
            <ul className="space-y-2">
              {quote.tasks.map((task, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {task}
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* Bidding Range */}
          <section>
            <h3 className="font-semibold mb-3">Allowed Bidding Range</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Minimum:</span>
                <span className="font-medium">{formatCurrency(min)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Maximum:</span>
                <span className="font-medium">{formatCurrency(max)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Baseline:</span>
                <span className="font-medium">{formatCurrency(quote.baselinePrice)}</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Your Standing */}
          {standing.rank > 0 && (
            <>
              <section>
                <h3 className="font-semibold mb-3">Your Standing</h3>
                <BidStatPills 
                  standing={standing} 
                  credits={currentProvider.credits}
                  winRate={currentProvider.winRate}
                />
                {existingBid && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                    <div className="text-sm">
                      <span className="text-gray-500">Your current bid:</span>
                      <span className="font-medium ml-2">{formatCurrency(existingBid.amount)}</span>
                    </div>
                  </div>
                )}
              </section>
              <Separator />
            </>
          )}

          {/* Bid Form */}
          <section>
            <h3 className="font-semibold mb-3">
              {existingBid ? 'Update Your Bid' : 'Place Your Bid'}
            </h3>
            
            {currentProvider.credits <= 0 ? (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="text-sm">
                  <div className="font-medium text-red-600">Out of Credits</div>
                  <div className="text-gray-500">
                    You're out of bid credits. Upgrade or wait for weekly reset.
                  </div>
                </div>
              </div>
            ) : (
              <BidPlaceForm
                quote={quote}
                policy={policy}
                existingBid={existingBid}
                onSuccess={handleBidSuccess}
              />
            )}
          </section>

          {/* Help Text */}
          <section className="text-xs text-gray-500 space-y-1">
            <p>• Standing updates every ~10 seconds</p>
            <p>• Exact competitor amounts are hidden for fairness</p>
            <p>• You can only revise your bid downward</p>
            <p>• Lowest bid auto-wins unless customer overrides</p>
          </section>
        </div>

        {/* Live region for screen readers */}
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
          id="standing-updates"
        >
          {standing.rank > 0 && 
            `You are currently ranked ${standing.rank} out of ${standing.totalBidders} bidders`
          }
        </div>
      </SheetContent>
    </Sheet>
  );
};