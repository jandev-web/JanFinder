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
import { MapPin, Square, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface QuoteDetailSheetProps {
  open: boolean;
  onClose: () => void;
  quote: any | null;
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

  function toDate(input: unknown): Date | null {
    if (!input) return null;
    if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

    // ISO string or millis
    if (typeof input === 'string' || typeof input === 'number') {
      const d = new Date(input as any);
      return isNaN(d.getTime()) ? null : d;
    }

    // Handle common shapes defensively (optional)
    if (typeof input === 'object') {
      const anyObj = input as any;
      // Firestore-like { seconds, nanos }
      if (typeof anyObj?.seconds === 'number') {
        const ms = anyObj.seconds * 1000 + Math.floor((anyObj.nanos ?? 0) / 1e6);
        const d = new Date(ms);
        return isNaN(d.getTime()) ? null : d;
      }
      // { iso: '...' } or { $date: '...' }
      if (typeof anyObj?.iso === 'string') {
        const d = new Date(anyObj.iso);
        return isNaN(d.getTime()) ? null : d;
      }
      if (typeof anyObj?.$date === 'string') {
        const d = new Date(anyObj.$date);
        return isNaN(d.getTime()) ? null : d;
      }
    }

    return null;
  }

  const confirmedAt = toDate(quote?.confirmationTimestamp);
  if (!confirmedAt) {
    console.error('Invalid confirmationTimestamp:', quote?.confirmationTimestamp);
    return;
  }
  const expiresAt = new Date(confirmedAt.getTime() + 48 * 60 * 60 * 1000);


  const quoteAddress = quote?.customerData?.address;

  const quoteAddressString =
    typeof quoteAddress === 'string'
      ? quoteAddress
      : [
        quoteAddress?.street,
        quoteAddress?.city,
        quoteAddress?.state,
        quoteAddress?.postalCode,
        quoteAddress?.country,
      ]
        .map(v => (v ?? '').toString().trim())
        .filter(Boolean)
        .join(', ');
  console.log(quoteAddressString)
  const pkg = quote?.package;

  // 1) Get the chosen packageType from packageChoice (object or string), fallback to packageChoice
  const chosenType =
    (pkg?.packageChoice && typeof pkg.packageChoice === 'object'
      ? (pkg.packageChoice as any)?.packageType
      : pkg?.packageChoice) ??
    pkg?.packageChoice;

  // 2) Find the matching option by packageType
  const selectedOption = (pkg?.packageOptions ?? []).find(
    (opt: any) => opt?.packageType === chosenType || opt?.packageType === pkg?.packageChoice
  );
  console.log(selectedOption)
  // 3) Use whatever price field your options carry
  const quotePrice = selectedOption?.packageCost


  // Calculate total time per month for all tasks
  const calculateTotalTime = () => {
    let total = 0;
    const allTasks = [
      ...(quote.rooms || []),
      ...(quote.carpet || []),
      ...(quote.hardfloor || [])
    ];
    allTasks.forEach(task => {
      total += parseFloat(task.timePerMonth.N);
    });
    return total;
  };

  const totalTimePerMonth = calculateTotalTime();

  // Get package type styling
  const getSheetBackgroundClass = () => {
    const packageType = quote.package?.packageChoice;
    switch (packageType) {
      case 'top':
        return 'bg-gradient-to-br from-accent/10 via-accent/5 to-background border-l-4 border-accent/30';
      case 'middle':
        return 'bg-gradient-to-br from-primary/10 via-primary/5 to-background border-l-4 border-primary/30';
      case 'bottom':
      default:
        return 'bg-background';
    }
  };

  const getPackageBadgeClass = () => {
    const packageType = quote.package?.packageChoice;
    switch (packageType) {
      case 'top':
        return 'bg-gradient-to-r from-accent to-accent/90 text-foreground border-0 shadow-lg shadow-accent/30 font-bold px-4 py-2 text-base animate-fade-in';
      case 'middle':
        return 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/30 font-bold px-4 py-2 text-base animate-fade-in';
      case 'bottom':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 font-bold px-4 py-2 text-base';
      default:
        return 'bg-gray-100 text-gray-700 px-4 py-2 text-base';
    }
  };

  const getSectionBackgroundClass = () => {
    const packageType = quote.package?.packageChoice;
    switch (packageType) {
      case 'top':
        return 'bg-white/80 backdrop-blur-sm border border-accent/20 shadow-sm';
      case 'middle':
        return 'bg-white/80 backdrop-blur-sm border border-primary/20 shadow-sm';
      case 'bottom':
      default:
        return 'bg-background';
    }
  };

  const handleBidSuccess = () => {
    // Refresh bids after successful submission
    fetchBids(quote.id);
  };
  console.log(quote.package.packageChoice)
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className={`w-full sm:max-w-lg overflow-y-auto ${getSheetBackgroundClass()}`} side="right">
        <SheetHeader className="space-y-3">
          {/* Package Type at the very top */}
          {quote.package?.packageChoice && (
            <div className="flex justify-center mb-2">
              <Badge className={`text-sm ${getPackageBadgeClass()}`}>
                {quote.package.packageChoice.toUpperCase()} PACKAGE
              </Badge>
            </div>
          )}

          <div className="text-left space-y-2">
            <SheetTitle className="text-xl">{quote.title}</SheetTitle>
            <SheetDescription className="flex items-center gap-1 text-base">
              <MapPin className="h-4 w-4" />
              {quote.location}
            </SheetDescription>
          </div>

          <div className="flex items-center justify-between">
            <Countdown expiresAt={expiresAt} className="text-base" />
            <div className="flex gap-2">
              <Badge variant="outline" className="text-sm flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {totalTimePerMonth.toFixed(1)}h/month
              </Badge>
              <Badge variant="outline" className="text-sm">
                Baseline: {formatCurrency(quotePrice)}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <div className={`space-y-6 py-6 ${quote.package?.packageChoice !== 'bottom' ? 'px-1' : ''}`}>
          {/* Summary Section */}
          <section className={`p-4 rounded-lg ${getSectionBackgroundClass()}`}>
            <h3 className="font-semibold mb-3">Quote Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-gray-500" />
                <span>{quote.quoteInfo.sqft.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{quote.frequency}</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Tasks Section */}
          <section className={`p-4 rounded-lg ${getSectionBackgroundClass()}`}>
            <h3 className="font-semibold mb-3">Required Tasks</h3>
            <div className="space-y-4">
              {/* Rooms Tasks */}
              {selectedOption.rooms && selectedOption.rooms.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Room Tasks</h4>
                  <ul className="space-y-2">
                    {selectedOption.rooms.map((task: any, index: any) => (
                      <li key={`room-${index}`} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>{task.taskName}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{parseFloat(task.timePerMonth).toFixed(1)}h/mo</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Carpet Tasks */}
              {selectedOption.carpet && selectedOption.carpet.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Carpet Tasks</h4>
                  <ul className="space-y-2">
                    {selectedOption.carpet.map((task: any, index: any) => (
                      <li key={`carpet-${index}`} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>{task.taskName}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{parseFloat(task.timePerMonth).toFixed(1)}h/mo</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hard Floor Tasks */}
              {selectedOption.hardfloor && selectedOption.hardfloor.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Hard Floor Tasks</h4>
                  <ul className="space-y-2">
                    {selectedOption.hardfloor.map((task: any, index: any) => (
                      <li key={`hardfloor-${index}`} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>{task.taskName}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{parseFloat(task.timePerMonth).toFixed(1)}h/mo</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Bidding Range */}
          <section className={`p-4 rounded-lg ${getSectionBackgroundClass()}`}>
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
                <span className="font-medium">{formatCurrency(quotePrice)}</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Your Standing */}
          {standing.rank > 0 && (
            <>
              <section className={`p-4 rounded-lg ${getSectionBackgroundClass()}`}>
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
          <section className={`p-4 rounded-lg ${getSectionBackgroundClass()}`}>
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