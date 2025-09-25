import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Countdown } from './Countdown';
import { BidStatPills } from './BidStatPills';
import { Quote, Standing } from './types';
import { formatCurrency } from '../../utils/validation';
import { MapPin, Square, Calendar, Eye } from 'lucide-react';

interface QuoteCardProps {
  quote: any;
  standing?: Standing;
  credits?: number;
  winRate?: number;
  onOpen: () => void;
  className?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  standing,
  credits,
  winRate,
  onOpen,
  className = ''
}) => {

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

  const confirmedAt = toDate(quote?.confirmationTimestamp);
  if (!confirmedAt) {
    console.error('Invalid confirmationTimestamp:', quote?.confirmationTimestamp);
    return;
  }
  const expiresAt = new Date(confirmedAt.getTime() + 48 * 60 * 60 * 1000);

  const getPackageType = () => {
    const t = (chosenType ?? '').toString().trim().toLowerCase();

    switch (t) {
      case 'top':
        return 'border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 shadow-lg shadow-accent/20';
      case 'middle':
        return 'border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20';
      case 'bottom':
        return 'border border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getPackageBadgeClass = () => {
    const t = (chosenType ?? '').toString().trim().toLowerCase();

    switch (t) {
      case 'top':
        return 'bg-gradient-to-r from-accent to-accent/90 text-foreground border-0 shadow-lg shadow-accent/30 font-bold';
      case 'middle':
        return 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/30 font-bold';
      case 'bottom':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 font-bold';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };


  const getPackageName = () => {
    const t = (chosenType ?? '').toString().trim().toLowerCase();

    switch (t) {
      case 'top':
        return '✨ Elite Package ✨';
      case 'middle':
        return 'Pristine Package';
      case 'bottom':
        return 'Essentials Package';
      default:
        return '';
    }
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${getPackageType()} ${className}`}
      onClick={onOpen}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {chosenType && (
            <div className="flex items-center justify-center py-2 px-3 -mx-1 -mt-1 mb-3 rounded-t-lg">
              <Badge
                className={`text-sm font-bold uppercase tracking-wider px-4 py-1.5 ${getPackageBadgeClass()}`}
              >
                {getPackageName()}
              </Badge>
            </div>
          )}
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{quote.customerData.company}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{quoteAddressString}</span>
              </div>
            </div>

            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {formatCurrency(quotePrice)}
            </Badge>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Square className="h-3 w-3" />
              {quote.quoteInfo.sqft.toLocaleString()} sq ft
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {quote.frequency}
            </div>
          </div>

          {/* Standing pills */}
          {standing && credits !== undefined && (
            <BidStatPills
              standing={standing}
              credits={credits}
              winRate={winRate}
            />
          )}

          {/* Countdown */}
          <div className="flex items-center justify-between">
            <Countdown expiresAt={expiresAt} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          {standing?.rank ? 'Update Bid' : 'Place Bid'}
        </Button>
      </CardFooter>
    </Card>
  );
};