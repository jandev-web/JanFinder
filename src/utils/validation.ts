import { BiddingPolicy, ValidationResult } from '../components/bidding/types';

export const withinRange = (
  amount: number,
  baseline: number,
  policy: BiddingPolicy
): ValidationResult => {
  const min = baseline * policy.minPct;
  const max = baseline * policy.maxPct;
  const floor = baseline * policy.floorHardStopPct;

  if (amount < floor) {
    return {
      ok: false,
      min,
      max,
      floor,
      message: `This bid is below the allowed floor ($${floor.toFixed(2)}). Increase your bid.`
    };
  }

  if (amount < min) {
    return {
      ok: false,
      min,
      max,
      floor,
      message: `Bid must be at least $${min.toFixed(2)} (${(policy.minPct * 100).toFixed(0)}% of baseline).`
    };
  }

  if (amount > max) {
    return {
      ok: false,
      min,
      max,
      floor,
      message: `Bid cannot exceed $${max.toFixed(2)} (${(policy.maxPct * 100).toFixed(0)}% of baseline).`
    };
  }

  return {
    ok: true,
    min,
    max,
    floor
  };
};

export const isLowerThanPrior = (newAmount: number, priorAmount: number): boolean => {
  return newAmount < priorAmount;
};

export const formatRange = (baseline: number, policy: BiddingPolicy): string => {
  const min = baseline * policy.minPct;
  const max = baseline * policy.maxPct;
  const floor = baseline * policy.floorHardStopPct;
  
  return `Allowed: $${min.toFixed(2)} – $${max.toFixed(2)} (floor $${floor.toFixed(2)})`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};