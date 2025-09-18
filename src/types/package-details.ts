// types/package-details.ts

/** Marketing tiers (UI copy) */
export type PackageType = 'Standard' | 'Pristine' | 'Elite';

export interface PackageDetails {
  name: PackageType;
  description: string;
  features: string[];
  /**
   * Optional so your existing array (without prices) still type-checks.
   * Add when you introduce pricing.
   */
  
}

/** Default package catalog for UI */
export const PACKAGE_DETAILS: readonly PackageDetails[] = [
  {
    name: 'Standard',
    description: 'Essential cleaning for everyday maintenance',
    features: [
      'Trash removal',
      'Vacuum carpets',
      'Dust surfaces',
      'Clean restrooms',
      'Empty recycling',
    ],
  },
  {
    name: 'Pristine',
    description: 'Comprehensive cleaning for professional spaces',
    features: [
      'Everything in Standard',
      'Deep carpet cleaning',
      'Window cleaning',
      'Kitchen sanitization',
      'Floor mopping',
    ],
  },
  {
    name: 'Elite',
    description: 'Premium service for exceptional cleanliness',
    features: [
      'Everything in Pristine',
      'High-touch disinfection',
      'Detailed furniture cleaning',
      'Supply restocking',
      'Quality inspections',
    ],
  },
] as const;
