import { create } from 'zustand';
import { Quote, Bid, Provider, BiddingPolicy, CustomerDecision, Standing } from '../components/bidding/types';
import { standingFor, getTop3Bids } from '../utils/ranking';

interface BiddingStore {
  // State
  quotes: Quote[];
  bids: Bid[];
  providers: Provider[];
  policy: BiddingPolicy;
  currentProvider: Provider | null;
  customerDecisions: CustomerDecision[];
  loading: boolean;
  error: string | null;

  // Computed
  bidsByQuote: (quoteId: string) => Bid[];
  top3ByQuote: (quoteId: string) => Bid[];
  myStanding: (quoteId: string) => Standing;
  myBidForQuote: (quoteId: string) => Bid | undefined;

  // Actions
  fetchQuotes: () => Promise<void>;
  fetchBids: (quoteId: string) => Promise<void>;
  fetchPolicy: () => Promise<void>;
  placeBid: (quoteId: string, amount: number) => Promise<void>;
  updateBid: (bidId: string, amount: number) => Promise<void>;
  setCustomerDecision: (decision: CustomerDecision) => Promise<void>;
  updatePolicy: (policy: BiddingPolicy) => Promise<void>;
  grantCredits: (providerId: string, credits: number) => Promise<void>;
}

// Mock data
const mockPolicy: BiddingPolicy = {
  minPct: 0.7,
  maxPct: 1.2,
  floorHardStopPct: 0.65,
  defaultWindowMins: 1440
};

const mockProviders: Provider[] = [
  {
    id: 'provider-1',
    name: 'CleanPro Services',
    rating: 4.8,
    reviewCount: 156,
    region: 'Downtown',
    reputationScore: 95,
    credits: 12,
    winRate: 0.73
  },
  {
    id: 'provider-2',
    name: 'Sparkle Clean Co',
    rating: 4.6,
    reviewCount: 203,
    region: 'Midtown',
    reputationScore: 87,
    credits: 8,
    winRate: 0.68
  },
  {
    id: 'provider-3',
    name: 'Elite Cleaning',
    rating: 4.9,
    reviewCount: 89,
    region: 'Uptown',
    reputationScore: 98,
    credits: 15,
    winRate: 0.81
  }
];

const mockQuotes: Quote[] = [
  {
    id: 'quote-1',
    title: 'Downtown Office Complex',
    location: '123 Business Ave, Downtown',
    sqft: 5000,
    frequency: 'Weekly',
    tasks: ['Vacuum carpets', 'Clean restrooms', 'Empty trash', 'Dust surfaces'],
    baselinePrice: 850,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    customerId: 'customer-1',
    status: 'OPEN'
  },
  {
    id: 'quote-2',
    title: 'Medical Center Sanitization',
    location: '456 Health St, Midtown',
    sqft: 3200,
    frequency: 'Daily',
    tasks: ['Deep sanitization', 'Medical waste disposal', 'Floor mopping', 'Window cleaning'],
    baselinePrice: 1200,
    expiresAt: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    customerId: 'customer-2',
    status: 'OPEN'
  },
  {
    id: 'quote-3',
    title: 'Retail Store Chain',
    location: '789 Shopping Blvd, Uptown',
    sqft: 8000,
    frequency: '3 Days a Week',
    tasks: ['Floor maintenance', 'Restroom cleaning', 'Trash removal', 'Glass cleaning'],
    baselinePrice: 2100,
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    customerId: 'customer-3',
    status: 'OPEN'
  }
];

let mockBids: Bid[] = [
  {
    id: 'bid-1',
    quoteId: 'quote-1',
    providerId: 'provider-1',
    amount: 750,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isActive: true
  },
  {
    id: 'bid-2',
    quoteId: 'quote-1',
    providerId: 'provider-2',
    amount: 780,
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    isActive: true
  },
  {
    id: 'bid-3',
    quoteId: 'quote-2',
    providerId: 'provider-1',
    amount: 1100,
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    isActive: true
  }
];

export const useBiddingStore = create<BiddingStore>((set, get) => ({
  // Initial state
  quotes: [],
  bids: [],
  providers: mockProviders,
  policy: mockPolicy,
  currentProvider: mockProviders[0], // Simulate logged in as first provider
  customerDecisions: [],
  loading: false,
  error: null,

  // Computed getters
  bidsByQuote: (quoteId: string) => {
    return get().bids.filter(bid => bid.quoteId === quoteId && bid.isActive);
  },

  top3ByQuote: (quoteId: string) => {
    const bids = get().bidsByQuote(quoteId);
    return getTop3Bids(bids, get().providers);
  },

  myStanding: (quoteId: string) => {
    const currentProvider = get().currentProvider;
    if (!currentProvider) return { rank: 0, totalBidders: 0, isLowest: false };
    
    const bids = get().bidsByQuote(quoteId);
    return standingFor(currentProvider.id, bids, get().providers);
  },

  myBidForQuote: (quoteId: string) => {
    const currentProvider = get().currentProvider;
    if (!currentProvider) return undefined;
    
    return get().bids.find(bid => 
      bid.quoteId === quoteId && 
      bid.providerId === currentProvider.id && 
      bid.isActive
    );
  },

  // Actions
  fetchQuotes: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ quotes: mockQuotes, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch quotes', loading: false });
    }
  },

  fetchBids: async (quoteId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const quoteBids = mockBids.filter(bid => bid.quoteId === quoteId);
      set(state => ({
        bids: [...state.bids.filter(bid => bid.quoteId !== quoteId), ...quoteBids],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to fetch bids', loading: false });
    }
  },

  fetchPolicy: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      set({ policy: mockPolicy, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch policy', loading: false });
    }
  },

  placeBid: async (quoteId: string, amount: number) => {
    const currentProvider = get().currentProvider;
    if (!currentProvider) throw new Error('No current provider');
    
    if (currentProvider.credits <= 0) {
      throw new Error('Insufficient credits');
    }

    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        quoteId,
        providerId: currentProvider.id,
        amount,
        timestamp: new Date(),
        isActive: true
      };

      // Add to mock data
      mockBids.push(newBid);
      
      set(state => ({
        bids: [...state.bids, newBid],
        providers: state.providers.map(p => 
          p.id === currentProvider.id 
            ? { ...p, credits: p.credits - 1 }
            : p
        ),
        currentProvider: { ...currentProvider, credits: currentProvider.credits - 1 },
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to place bid', loading: false });
    }
  },

  updateBid: async (bidId: string, amount: number) => {
    const currentProvider = get().currentProvider;
    if (!currentProvider) throw new Error('No current provider');

    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Update mock data
      mockBids = mockBids.map(bid => 
        bid.id === bidId 
          ? { ...bid, amount, timestamp: new Date() }
          : bid
      );
      
      set(state => ({
        bids: state.bids.map(bid => 
          bid.id === bidId 
            ? { ...bid, amount, timestamp: new Date() }
            : bid
        ),
        providers: state.providers.map(p => 
          p.id === currentProvider.id 
            ? { ...p, credits: p.credits - 1 }
            : p
        ),
        currentProvider: { ...currentProvider, credits: currentProvider.credits - 1 },
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update bid', loading: false });
    }
  },

  setCustomerDecision: async (decision: CustomerDecision) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      set(state => ({
        customerDecisions: [...state.customerDecisions, decision],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to set customer decision', loading: false });
    }
  },

  updatePolicy: async (policy: BiddingPolicy) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ policy, loading: false });
    } catch (error) {
      set({ error: 'Failed to update policy', loading: false });
    }
  },

  grantCredits: async (providerId: string, credits: number) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      set(state => ({
        providers: state.providers.map(p => 
          p.id === providerId 
            ? { ...p, credits: p.credits + credits }
            : p
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to grant credits', loading: false });
    }
  }
}));