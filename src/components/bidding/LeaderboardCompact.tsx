import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ProviderBadge } from './ProviderBadge';
import { Bid, Provider } from './types';
import { formatCurrency } from '../../utils/validation';
import { Trophy, DollarSign } from 'lucide-react';

interface LeaderboardCompactProps {
  bids: Bid[];
  providers: Provider[];
  baselinePrice: number;
  showPrices?: boolean;
  className?: string;
}

export const LeaderboardCompact: React.FC<LeaderboardCompactProps> = ({ 
  bids, 
  providers, 
  baselinePrice,
  showPrices = false,
  className = '' 
}) => {
  const getProvider = (providerId: string) => {
    return providers.find(p => p.id === providerId);
  };

  const getPriceIndicator = (amount: number) => {
    const ratio = amount / baselinePrice;
    if (ratio <= 0.8) return { symbol: '$', label: 'Low', variant: 'default' as const };
    if (ratio <= 1.0) return { symbol: '$$', label: 'Moderate', variant: 'secondary' as const };
    return { symbol: '$$$', label: 'Premium', variant: 'outline' as const };
  };

  if (bids.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Bids will appear here once providers start competing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
          <Trophy className="h-4 w-4" />
          Top {Math.min(3, bids.length)} Bid{bids.length !== 1 ? 's' : ''}
        </div>

        {bids.slice(0, 3).map((bid, index) => {
          const provider = getProvider(bid.providerId);
          if (!provider) return null;

          const priceIndicator = getPriceIndicator(bid.amount);
          const isWinning = index === 0;

          return (
            <div 
              key={bid.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isWinning ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  isWinning ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                
                <ProviderBadge 
                  provider={provider} 
                  showDetails={false}
                />
              </div>

              <div className="flex items-center gap-2">
                {showPrices ? (
                  <span className="font-medium">{formatCurrency(bid.amount)}</span>
                ) : (
                  <Badge variant={priceIndicator.variant} className="text-xs">
                    {priceIndicator.symbol}
                  </Badge>
                )}
                
                {isWinning && (
                  <Badge variant="default" className="text-xs">
                    Winning
                  </Badge>
                )}
              </div>
            </div>
          );
        })}

        {!showPrices && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Price indicators: $ = Below baseline, $$ = Near baseline, $$$ = Above baseline
          </div>
        )}
      </CardContent>
    </Card>
  );
};