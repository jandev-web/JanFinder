export interface BiddingPolicy {
  minPct: number; // e.g., 0.7 for 70%
  maxPct: number; // e.g., 1.2 for 120%
  floorHardStopPct: number; // e.g., 0.65 for 65%
  defaultWindowMins: number; // e.g., 1440 for 24 hours
}

export interface Provider {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  region: string;
  reputationScore: number;
  credits: number;
  winRate: number;
}

export interface Bid {
  id: string;
  quoteId: string;
  providerId: string;
  amount: number;
  timestamp: Date;
  isActive: boolean;
}

export interface Quote {
  id: string;
  title: string;
  location: string;
  sqft: number;
  frequency: string;
  tasks: string[];
  baselinePrice: number;
  expiresAt: Date;
  createdAt: Date;
  customerId: string;
  status: 'OPEN' | 'CLOSED' | 'AWARDED';
}

export interface CustomerDecision {
  quoteId: string;
  mode: 'AUTO_LOWEST' | 'CUSTOMER_OVERRIDE';
  chosenBidId?: string;
  decidedAt: Date;
}

export interface Standing {
  rank: number;
  totalBidders: number;
  isLowest: boolean;
  bidId?: string;
}

export interface ValidationResult {
  ok: boolean;
  min: number;
  max: number;
  floor: number;
  message?: string;
}

export type TimeGroup = '5min' | '1hour' | '24hour' | 'later';

export interface GroupedQuotes {
  '5min': Quote[];
  '1hour': Quote[];
  '24hour': Quote[];
  'later': Quote[];
}