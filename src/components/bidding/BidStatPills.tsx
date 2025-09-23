import React from 'react';
import { Badge } from '../ui/badge';
import { Standing } from './types';
import { Trophy, Users, Star } from 'lucide-react';

interface BidStatPillsProps {
  standing: Standing;
  credits: number;
  winRate?: number;
  className?: string;
}

export const BidStatPills: React.FC<BidStatPillsProps> = ({ 
  standing, 
  credits, 
  winRate,
  className = '' 
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Ranking */}
      {standing.rank > 0 && (
        <Badge variant={standing.isLowest ? "default" : "secondary"} className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          {standing.isLowest ? 'Lowest' : `#${standing.rank}`}
        </Badge>
      )}

      {/* Total bidders */}
      {standing.totalBidders > 0 && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {standing.totalBidders} bidder{standing.totalBidders !== 1 ? 's' : ''}
        </Badge>
      )}

      {/* Credits remaining */}
      <Badge 
        variant={credits <= 2 ? "destructive" : "secondary"} 
        className="flex items-center gap-1"
      >
        <Star className="h-3 w-3" />
        {credits} credit{credits !== 1 ? 's' : ''}
      </Badge>

      {/* Win rate (optional) */}
      {winRate !== undefined && (
        <Badge variant="outline" className="text-xs">
          {Math.round(winRate * 100)}% win rate
        </Badge>
      )}
    </div>
  );
};