

export type PackageType = 'Standard' | 'Pristine' | 'Elite';

export interface ContactInfo {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface RoomSelection {
  roomType: string;
  count: number;
}

export interface FloorTypePercentages {
  hardfloor: number;
  carpet: number;
}

export interface QuoteInfo {
  contact: ContactInfo;
  budget: number;
  facilityType: string;
  floors: number;
  stairwellsCarpeted: number;
  stairwellsHardfloor: number;
  sqft: number;
  floorTypePercentages: FloorTypePercentages;
  rooms: RoomSelection[];
  frequency: string;
  selectedPackage: any;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface PackageDetails {
  name: PackageType;
  description: string;
  features: string[];
  basePrice: number;
}

export const ROOM_TYPES = [
  'Offices',
  'Restrooms',
  'Breakrooms',
  'Conference Rooms',
  'Lobby',
  'Hallways',
  'Reception Area',
  'Kitchen',
  'Storage Rooms',
  'Server Room',
  'Training Rooms',
  'Private Offices'
];

export const PACKAGE_DETAILS: PackageDetails[] = [
  {
    name: 'Standard',
    description: 'Essential cleaning for everyday maintenance',
    features: ['Trash removal', 'Vacuum carpets', 'Dust surfaces', 'Clean restrooms', 'Empty recycling'],
    basePrice: 0.08
  },
  {
    name: 'Pristine',
    description: 'Comprehensive cleaning for professional spaces',
    features: ['Everything in Standard', 'Deep carpet cleaning', 'Window cleaning', 'Kitchen sanitization', 'Floor mopping'],
    basePrice: 0.12
  },
  {
    name: 'Elite',
    description: 'Premium service for exceptional cleanliness',
    features: ['Everything in Pristine', 'High-touch disinfection', 'Detailed furniture cleaning', 'Supply restocking', 'Quality inspections'],
    basePrice: 0.18
  }
];