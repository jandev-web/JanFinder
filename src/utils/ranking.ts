import { Bid, Provider, Standing } from '../components/bidding/types';

export const rankBids = (bids: Bid[], providers: Provider[]): Bid[] => {
  const activeBids = bids.filter(bid => bid.isActive);
  
  return activeBids.sort((a, b) => {
    // First, sort by amount (ascending - lowest first)
    if (a.amount !== b.amount) {
      return a.amount - b.amount;
    }
    
    // If amounts are equal, sort by timestamp (earlier first)
    if (a.timestamp.getTime() !== b.timestamp.getTime()) {
      return a.timestamp.getTime() - b.timestamp.getTime();
    }
    
    // If timestamps are equal, sort by reputation score (higher first)
    const providerA = providers.find(p => p.id === a.providerId);
    const providerB = providers.find(p => p.id === b.providerId);
    
    const reputationA = providerA?.reputationScore || 0;
    const reputationB = providerB?.reputationScore || 0;
    
    return reputationB - reputationA;
  });
};

export const standingFor = (
  providerId: string,
  bids: Bid[],
  providers: Provider[]
): Standing => {
  const rankedBids = rankBids(bids, providers);
  const myBidIndex = rankedBids.findIndex(bid => bid.providerId === providerId);
  
  if (myBidIndex === -1) {
    return {
      rank: 0,
      totalBidders: rankedBids.length,
      isLowest: false
    };
  }
  
  return {
    rank: myBidIndex + 1,
    totalBidders: rankedBids.length,
    isLowest: myBidIndex === 0,
    bidId: rankedBids[myBidIndex].id
  };
};

export const getTop3Bids = (bids: Bid[], providers: Provider[]): Bid[] => {
  const rankedBids = rankBids(bids, providers);
  return rankedBids.slice(0, 3);
};

export const getTimeGroup = (expiresAt: Date): '5min' | '1hour' | '24hour' | 'later' => {
  const now = new Date();
  const timeRemaining = expiresAt.getTime() - now.getTime();
  const minutesRemaining = timeRemaining / (1000 * 60);
  
  if (minutesRemaining <= 5) return '5min';
  if (minutesRemaining <= 60) return '1hour';
  if (minutesRemaining <= 1440) return '24hour'; // 24 hours
  return 'later';
};