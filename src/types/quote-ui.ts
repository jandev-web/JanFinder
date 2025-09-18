// types/quote-ui.ts
import type { RoomSelection } from './rooms';

export interface ContactInfo {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  /** Street line */
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface FloorTypePercentages {
  hardfloor: number;
  carpet: number;
}

/** UI form model for the quote wizard */
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
  /** Your UI stores an identifier/string here */
  selectedPackage: string;
  selectedCost: number;
  selectedName: string;
}

/** Generic UI error map */
export type ValidationErrors = Record<string, string>;
