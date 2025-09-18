import { z } from "zod";
import { AddressSchema } from "./address";
import { PackageSetSchema, CleaningFrequencySchema } from "./packages";

// ---- helpers ----
export const IsoTimestampSchema = z.string().min(1);
export const UUIDSchema = z.string().uuid().or(z.string().min(1));
export const FlagSchema = z.enum(["TRUE", "FALSE"]); // only for GSI-keyable flags

// ---- sub-objects ----
export const RoomTypeSelectionSchema = z.object({
  roomType: z.string(),
  count: z.number().int(),
});

export const StairwellsSchema = z.object({
  carpet: z.number().int(),
  hardfloor: z.number().int(),
});

export const FloorTypePercentagesSchema = z.object({
  carpet: z.number(),
  hardfloor: z.number(),
});

export const SharedMeasurementsSchema = z.object({
  sqft: z.number(),
  floors: z.number().int(),
  stairwells: StairwellsSchema,
  floorTypes: FloorTypePercentagesSchema,
  roomTypes: z.array(RoomTypeSelectionSchema),
});

export const CustomerDataSchema = z.object({
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  company: z.string().optional(),
  // keep email OPTIONAL here to avoid duplication with top-level email GSI key
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
});

export const QuoteInfoSchema = z.object({
  budget: z.number().optional(),
  facilityType: z.string().default(""),
  floorTypes: FloorTypePercentagesSchema,
  floors: z.number().int(),
  frequency: z.union([CleaningFrequencySchema, z.string()]).default(""),
  roomTypes: z.array(RoomTypeSelectionSchema),
  sqft: z.number(),
  stairwells: StairwellsSchema,
});

export const SiteVerificationSchema = z.object({
  verificationStatus: z.boolean(),
  verifiedBy: z.string().nullable().optional(),
  verificationTimestamp: z.string().nullable().optional(),
});

export const CostCalculationsSchema = z.object({
  salary: z.number(),
  payrollTax: z.number(),
  profitPercent: z.number(),
  overhead: z.number(),
});

export const CostInfoSchema = z.object({
  baseCost: z.number(),
  finalCost: z.number(),
  customCost: z.number().nullable().optional(),
});

// ---- primary entity ----
export const QuoteSchema = z.object({
  // PK (matches your actual table)
  QuoteID: UUIDSchema,

  // GSI partition keys (string-based for GSIs)
  // Keep strings for flags because your GSI needs a string partition key.
  isAvailable: FlagSchema, // GSI: AvailableQuotesIndex (PK=isAvailable)
  isAccepted:  FlagSchema,
  isSold:      FlagSchema,

  // Optional GSIs
  // GSI: email-ConfirmationNumber-index (PK=email, SK=confirmationNumber)
  // These MUST be omitted when unknown (no empty strings).
  email: z.string().email().optional(),
  confirmationNumber: z.string().min(1).optional(),

  // Owner/franchise lookups (recommend renaming GSIs to match camelCase soon)
  ownerID: z.string().nullable(),
  franchiseID: z.string().nullable(),

  // timestamps & meta
  createdAt: IsoTimestampSchema,
  updatedAt: IsoTimestampSchema.optional(),
  memberMade: z.boolean(),

  // files
  quotePDF: z.string().nullable(),
  contractPDF: z.string().nullable(),
  confirmationTimestamp: z.string().nullable(),
  acceptedTimestamp: z.string().nullable(),

  // customer & measurements
  customerData: CustomerDataSchema,
  customerMeasurements: SharedMeasurementsSchema,
  ownerMeasurements: SharedMeasurementsSchema,

  // costs & package
  costCalculations: CostCalculationsSchema,
  costInfo: CostInfoSchema,
  quoteInfo: QuoteInfoSchema,
  package: PackageSetSchema.optional(),

  // verification
  siteVerified: SiteVerificationSchema,
});

export type Quote = z.infer<typeof QuoteSchema>;
export type FloorTypes = z.infer<typeof FloorTypePercentagesSchema>;
export type FloorTypePercentages = FloorTypes;
export type RoomTypeSelection = z.infer<typeof RoomTypeSelectionSchema>;
export type Stairwells = z.infer<typeof StairwellsSchema>;
export type SharedMeasurements = z.infer<typeof SharedMeasurementsSchema>;
export type CustomerData = z.infer<typeof CustomerDataSchema>;
export type QuoteInfo = z.infer<typeof QuoteInfoSchema>;
export type CostCalculations = z.infer<typeof CostCalculationsSchema>;
export type CostInfo = z.infer<typeof CostInfoSchema>;
export type SiteVerification = z.infer<typeof SiteVerificationSchema>;
