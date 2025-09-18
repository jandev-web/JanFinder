// src/data/frequencyOptions.ts

export const FREQUENCY_OPTIONS = [
  'One Time',
  'Weekly',
  '2 Days a Week',
  '3 Days a Week',
  '4 Days a Week',
  '5 Days a Week',
  '6 Days a Week',
  '7 Days a Week',
  'Bi-Weekly',
  'Monthly',
  'Quarterly',
  'Yearly',
] as const;

export type FrequencyLabel = typeof FREQUENCY_OPTIONS[number];

export type FrequencyDetails = {
  description: string;
  icon: string;                 // emoji for now
  multiplier: number | null;    // visits/month; null for one-time
  recommended?: string;
  popular?: boolean;
};

export const WEEKS_PER_MONTH = 4.33;

/** Compute visits/month from a label. */
export function calcMonthlyVisits(label: string): number | null {
  if (/^One Time$/i.test(label)) return null;

  const daysMatch = label.match(/^(\d+)\s+Days?\s+a\s+Week$/i);
  if (daysMatch) {
    const d = parseInt(daysMatch[1], 10);
    return parseFloat((d * WEEKS_PER_MONTH).toFixed(2));
  }

  if (/^Weekly$/i.test(label)) return parseFloat(WEEKS_PER_MONTH.toFixed(2));
  if (/^Bi-Weekly$/i.test(label)) return parseFloat((WEEKS_PER_MONTH / 2).toFixed(2));
  if (/^Monthly$/i.test(label)) return 1;
  if (/^Quarterly$/i.test(label)) return parseFloat((1 / 3).toFixed(2));
  if (/^Yearly$/i.test(label)) return parseFloat((1 / 12).toFixed(2));
  if (/^7 Days a Week$/i.test(label) || /^Daily$/i.test(label)) {
    return parseFloat((7 * WEEKS_PER_MONTH).toFixed(2));
  }

  return null;
}

/** Hand-authored copy/icons for common choices. */
const META: Partial<Record<string, FrequencyDetails>> = {
  'One Time': {
    description: 'Perfect for move-ins, events, or deep cleaning projects',
    icon: '⚡',
    multiplier: null,
    recommended: 'Special occasions',
  },
  'Weekly': {
    description: 'Ideal for smaller offices and low-traffic facilities',
    icon: '📅',
    multiplier: parseFloat(WEEKS_PER_MONTH.toFixed(2)),
    recommended: 'Small offices',
  },
  '2 Days a Week': {
    description: 'Good balance for medium-sized offices with moderate traffic',
    icon: '📋',
    multiplier: parseFloat((2 * WEEKS_PER_MONTH).toFixed(2)),
    recommended: 'Medium offices',
  },
  '3 Days a Week': {
    description: 'Suitable for busy offices and professional environments',
    icon: '📊',
    multiplier: parseFloat((3 * WEEKS_PER_MONTH).toFixed(2)),
    recommended: 'Busy offices',
    popular: true,
  },
  '5 Days a Week': {
    description: 'Comprehensive care for high-traffic business facilities',
    icon: '🏢',
    multiplier: parseFloat((5 * WEEKS_PER_MONTH).toFixed(2)),
    recommended: 'High-traffic',
    popular: true,
  },
  // Provide explicit entries for the expanded set (optional — pattern fallback handles these too)
  '4 Days a Week': {
    description: 'Regular service for active teams and steady foot traffic',
    icon: '📊',
    multiplier: parseFloat((4 * WEEKS_PER_MONTH).toFixed(2)),
    recommended: 'Steady upkeep',
  },
  '6 Days a Week': {
    description: 'Near-daily coverage for very active operations',
    icon: '🏢',
    multiplier: parseFloat((6 * WEEKS_PER_MONTH).toFixed(2)),
    recommended: 'High-traffic',
  },
  '7 Days a Week': {
    description: 'Premium daily service for critical environments',
    icon: '🌟',
    multiplier: parseFloat((7 * WEEKS_PER_MONTH).toFixed(2)),
    recommended: 'Medical/Critical',
  },
  'Bi-Weekly': {
    description: 'Light maintenance every other week',
    icon: '↔️',
    multiplier: parseFloat((WEEKS_PER_MONTH / 2).toFixed(2)),
    recommended: 'Low/moderate traffic',
  },
  'Monthly': {
    description: 'Periodic maintenance or deep cleaning once a month',
    icon: '📆',
    multiplier: 1,
    recommended: 'Periodic upkeep',
  },
  'Quarterly': {
    description: 'Seasonal deep cleaning and maintenance',
    icon: '🗓️',
    multiplier: parseFloat((1 / 3).toFixed(2)),
    recommended: 'Low-usage facilities',
  },
  'Yearly': {
    description: 'Annual deep clean for long-term upkeep',
    icon: '🗓️',
    multiplier: parseFloat((1 / 12).toFixed(2)),
    recommended: 'Very low usage',
  },
  // Alias if someone ever passes "Daily"
  'Daily': {
    description: 'Premium daily service for critical environments',
    icon: '🌟',
    multiplier: parseFloat((7 * WEEKS_PER_MONTH).toFixed(2)),
    recommended: 'Medical/Critical',
  },
};

/** Derive details for any allowed label (uses patterns as fallback). */
export function getFrequencyDetails(label: string): FrequencyDetails {
  const fromMeta = META[label];
  if (fromMeta) return fromMeta;

  const visits = calcMonthlyVisits(label);
  if (/^\d+\s+Days?\s+a\s+Week$/i.test(label)) {
    const d = parseInt(label, 10);
    return {
      description: 'Routine service to maintain a consistently clean environment',
      icon: '📊',
      multiplier: visits ?? 0,
      recommended: d >= 5 ? 'High-traffic' : 'Steady upkeep',
    };
  }
  if (/^Bi-Weekly$/i.test(label)) {
    return {
      description: 'Light maintenance every other week',
      icon: '↔️',
      multiplier: visits ?? 0,
      recommended: 'Low/moderate traffic',
    };
  }
  if (/^Monthly$/i.test(label)) {
    return {
      description: 'Periodic maintenance or deep cleaning once a month',
      icon: '📆',
      multiplier: 1,
      recommended: 'Periodic upkeep',
    };
  }
  if (/^Quarterly$/i.test(label)) {
    return {
      description: 'Seasonal deep cleaning and maintenance',
      icon: '🗓️',
      multiplier: visits ?? 0.33,
      recommended: 'Low-usage facilities',
    };
  }
  if (/^Yearly$/i.test(label)) {
    return {
      description: 'Annual deep clean for long-term upkeep',
      icon: '🗓️',
      multiplier: visits ?? 0.08,
      recommended: 'Very low usage',
    };
  }
  if (/^7 Days a Week$/i.test(label)) {
    return {
      description: 'Premium daily service for critical environments',
      icon: '🌟',
      multiplier: visits ?? parseFloat((7 * WEEKS_PER_MONTH).toFixed(2)),
      recommended: 'Medical/Critical',
    };
  }

  // Absolute fallback
  return {
    description: 'Select the cadence that best fits your operations and foot traffic.',
    icon: '🧽',
    multiplier: visits ?? 1,
  };
}

export function isPopularFrequency(label: string): boolean {
  return !!META[label]?.popular || ['3 Days a Week', '5 Days a Week'].includes(label);
}
