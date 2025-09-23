import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Quote, BiddingPolicy, Bid } from './types';
import { useBiddingStore } from '../../state/bidding.store';
import { withinRange, isLowerThanPrior, formatCurrency, formatRange } from '../../utils/validation';
import { DollarSign, AlertCircle, Info } from 'lucide-react';

interface BidPlaceFormProps {
  quote: Quote;
  policy: BiddingPolicy;
  existingBid?: Bid;
  onSuccess?: () => void;
  className?: string;
}

export const BidPlaceForm: React.FC<BidPlaceFormProps> = ({ 
  quote, 
  policy, 
  existingBid,
  onSuccess,
  className = '' 
}) => {
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();
  
  const { 
    currentProvider, 
    placeBid, 
    updateBid, 
    loading 
  } = useBiddingStore();

  useEffect(() => {
    if (existingBid) {
      setAmount(existingBid.amount.toString());
    }
  }, [existingBid]);

  const validateAmount = (value: string) => {
    const numAmount = parseFloat(value);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return 'Please enter a valid amount';
    }

    const validation = withinRange(numAmount, quote.baselinePrice, policy);
    if (!validation.ok) {
      return validation.message || 'Invalid bid amount';
    }

    if (existingBid && !isLowerThanPrior(numAmount, existingBid.amount)) {
      return 'New bid must be lower than your previous bid';
    }

    return '';
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setValidationError(validateAmount(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProvider) {
      toast({
        title: "Error",
        description: "You must be logged in to place a bid",
        variant: "destructive"
      });
      return;
    }

    if (currentProvider.credits <= 0) {
      toast({
        title: "Insufficient Credits",
        description: "You're out of bid credits. Upgrade or wait for weekly reset.",
        variant: "destructive"
      });
      return;
    }

    const numAmount = parseFloat(amount);
    const error = validateAmount(amount);
    
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      if (existingBid) {
        await updateBid(existingBid.id, numAmount);
        toast({
          title: "Bid Updated",
          description: "Your bid has been successfully updated.",
        });
      } else {
        await placeBid(quote.id, numAmount);
        toast({
          title: "Bid Placed",
          description: "Your bid has been successfully submitted.",
        });
      }
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit bid",
        variant: "destructive"
      });
    }
  };

  const min = quote.baselinePrice * policy.minPct;
  const max = quote.baselinePrice * policy.maxPct;
  const floor = quote.baselinePrice * policy.floorHardStopPct;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="bid-amount">Bid Amount</Label>
          <Badge variant="outline" className="text-xs">
            Baseline: {formatCurrency(quote.baselinePrice)}
          </Badge>
        </div>
        
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="bid-amount"
            type="number"
            step="0.01"
            min={floor}
            max={max}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter your bid"
            className={`pl-10 ${validationError ? 'border-red-500' : ''}`}
            disabled={loading}
            aria-describedby="bid-range bid-error"
          />
        </div>

        {validationError && (
          <div id="bid-error" className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {validationError}
          </div>
        )}

        <div id="bid-range" className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="h-4 w-4" />
          {formatRange(quote.baselinePrice, policy)}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-500">
          Credits remaining: {currentProvider?.credits || 0}
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || !!validationError || !amount || (currentProvider?.credits || 0) <= 0}
          className="min-w-[120px]"
        >
          {loading ? '...' : existingBid ? 'Update Bid' : 'Place Bid'}
        </Button>
      </div>
    </form>
  );
};