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
  quote: Quote;
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
  const getUrgencyClass = () => {
    const now = new Date();
    const timeRemaining = quote.expiresAt.getTime() - now.getTime();
    const minutesRemaining = timeRemaining / (1000 * 60);
    
    if (minutesRemaining <= 5) return 'border-red-200 bg-red-50/50';
    if (minutesRemaining <= 60) return 'border-orange-200 bg-orange-50/50';
    return 'border-gray-200';
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${getUrgencyClass()} ${className}`}
      onClick={onOpen}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{quote.title}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{quote.location}</span>
              </div>
            </div>
            
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {formatCurrency(quote.baselinePrice)}
            </Badge>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Square className="h-3 w-3" />
              {quote.sqft.toLocaleString()} sq ft
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
            <Countdown expiresAt={quote.expiresAt} />
            
            <div className="text-xs text-gray-500">
              {quote.tasks.length} task{quote.tasks.length !== 1 ? 's' : ''}
            </div>
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