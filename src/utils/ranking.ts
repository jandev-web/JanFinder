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

// ranking.ts (or wherever this lives)
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

export const getTimeGroup = (
  confirmedAtInput: Date | string | number | null | undefined
): '5min' | '1hour' | '24hour' | 'later' => {
  const confirmedAt = toDate(confirmedAtInput);
  if (!confirmedAt) {
    // Optional: surface what came in to help track bad shapes
    console.warn('getTimeGroup: invalid confirmedAt', confirmedAtInput);
    return 'later';
  }

  // Expiry = 48 hours after confirmation
  const expiresAt = new Date(confirmedAt.getTime() + 48 * 60 * 60 * 1000);
  const minutesRemaining = (expiresAt.getTime() - Date.now()) / 60000;

  if (minutesRemaining <= 5) return '5min';
  if (minutesRemaining <= 60) return '1hour';
  if (minutesRemaining <= 1440) return '24hour'; // 24 hours
  return 'later';
};

