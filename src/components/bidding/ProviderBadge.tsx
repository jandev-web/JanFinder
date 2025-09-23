import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Star, MapPin } from 'lucide-react';
import { Provider } from './types';

interface ProviderBadgeProps {
  provider: Provider;
  showDetails?: boolean;
  className?: string;
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ 
  provider, 
  showDetails = true,
  className = '' 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-400/50 text-yellow-400' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getReputationVariant = (score: number) => {
    if (score >= 95) return 'default';
    if (score >= 85) return 'secondary';
    return 'outline';
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={provider.avatar} alt={provider.name} />
        <AvatarFallback className="text-sm font-medium">
          {getInitials(provider.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{provider.name}</h4>
          <Badge 
            variant={getReputationVariant(provider.reputationScore)}
            className="text-xs"
          >
            {provider.reputationScore}
          </Badge>
        </div>

        {showDetails && (
          <>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(provider.rating)}
              <span className="text-sm text-muted-foreground ml-1">
                {provider.rating} ({provider.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {provider.region}
            </div>
          </>
        )}
      </div>
    </div>
  );
};