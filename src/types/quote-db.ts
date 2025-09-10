// src/types/quote-db.ts

export type TrueFalse = 'True' | 'False';
export type MaybeNone<T extends string = string> = T | 'None';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Stairwells {
  carpet: number;
  hardfloor: number;
}

export interface FloorTypes {
  hardfloor: number;
  carpet: number;
}

export interface RoomTypeCount {
  roomType: string;
  count: number;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: Address;
}

export interface QuoteInfoBlock {
  budget: number;
  facilityType: string;
  roomTypes: RoomTypeCount[]; // stored as array of {roomType, count}
  sqft: number;
  floorTypes: FloorTypes;
  frequency: string; // e.g. 'Weekly' | '3 Days a Week' | ''
  stairwells: Stairwells;
  floors: number;
}

export interface CostCalculations {
  salary: number;
  payrollTax: number;
  overhead: number;
  profitPercent: number;
}

export interface PackageOption {
  // describe your package option shape here if known
  // keeping it loose for now:
  [k: string]: any;
}

export interface PackageBlock {
  packageOptions: {
    packageOne: PackageOption | null;
    packageTwo: PackageOption | null;
    packageThree: PackageOption | null;
  };
  packageChoice: string | null; // e.g. 'Standard' | 'Pristine' | 'Elite' | null
}

export interface CostInfo {
  finalCost: number;
  customCost: number | null;
  baseCost: number;
}

export interface SiteVerified {
  verificationStatus: TrueFalse | 'None';
  verificationTimestamp: MaybeNone<string>;
  verifiedBy: MaybeNone<string>;
}

export interface Measurements {
  roomTypes: RoomTypeCount[];
  floorTypes: FloorTypes;
  sqft: number;
  stairwells: Stairwells;
  floors: number;
}

export interface DBQuote {
  QuoteID: string;
  ConfirmationNumber: MaybeNone<string>;
  Franchise: MaybeNone<string>;
  OwnerID: MaybeNone<string>;
  IsAccepted: boolean;
  email: MaybeNone<string>;
  memberMade: boolean;

  customerData: CustomerData;
  quoteInfo: QuoteInfoBlock;

  costCalculations: CostCalculations;
  Package: PackageBlock;
  costInfo: CostInfo;

  Timestamp: string; // or number if epoch
  AcceptedTimestamp: MaybeNone<string>;
  Confirmed: boolean;

  QuotePDF: string | null;
  ContractPDF: string | null;
  ConfirmationTimestamp: MaybeNone<string>;

  isAvailable: TrueFalse;
  isSold: TrueFalse;

  siteVerified: SiteVerified;

  customerMeasurements: Measurements;
  ownerMeasurements: Measurements;

  latestRequest: any | null; // fill this in if you have a shape for requests
}
