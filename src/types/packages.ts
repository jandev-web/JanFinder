// types/packages.ts
import { z } from 'zod';

/** Tiers */
export const PackageTierSchema = z.enum(['top', 'middle', 'bottom']);
export type PackageTier = z.infer<typeof PackageTierSchema>;

/** Optional display labels */
export const PACKAGE_TIER_LABEL: Record<PackageTier, string> = {
  top: 'Elite',
  middle: 'Pristine',
  bottom: 'Standard',
};

/** Frequencies (aligned with your Lambda logic) */
export const CleaningFrequencySchema = z.union([
  z.literal('One Time'),
  z.literal('Weekly'),
  z.literal('1 Day a Week'),
  z.literal('2 Days a Week'),
  z.literal('3 Days a Week'),
  z.literal('4 Days a Week'),
  z.literal('5 Days a Week'),
  z.literal('6 Days a Week'),
  z.literal('7 Days a Week'),
  z.literal('Bi-Weekly'),
  z.literal('Monthly'),
  z.literal('Quarterly'),
  z.literal('Yearly'),
  z.literal('Daily'),
  z.literal('Daily-1'),
  z.literal('NA'),
  z.literal(''),
]);
export type CleaningFrequency = z.infer<typeof CleaningFrequencySchema>;

export const TaskBreakdownSchema = z.object({
  taskName: z.string(),
  frequency: z.union([CleaningFrequencySchema, z.string()]), // allow custom future values
  timePerDay: z.number(),
  timePerMonth: z.number(),
  timePerDayFromMonthly: z.number().optional(),
});
export type TaskBreakdown = z.infer<typeof TaskBreakdownSchema>;

export const FloorSectionBreakdownSchema = z.object({
  tasks: z.array(TaskBreakdownSchema),
  totalDayTime: z.number(),
  totalMonthTime: z.number(),
  totalDayTimeFromMonth: z.number().optional(),
});
export type FloorSectionBreakdown = z.infer<typeof FloorSectionBreakdownSchema>;

export const RoomBreakdownSchema = z.object({
  roomName: z.string(),
  roomNumber: z.number().int(),
  roomSize: z.number(),
  roomTasks: z.array(TaskBreakdownSchema),
  totalDayTime: z.number(),
  totalMonthTime: z.number(),
  totalDayTimeFromMonth: z.number().optional(),
});
export type RoomBreakdown = z.infer<typeof RoomBreakdownSchema>;

export const PackageOptionSchema = z.object({
  packageType: PackageTierSchema,
  packageName: z.string(),
  packageCost: z.number(),

  totalDayTime: z.number(),
  totalMonthTime: z.number(),
  totalDayTimeFromMonth: z.number().optional(),

  otherDayTime: z.number(),
  otherMonthTime: z.number(),
  otherDayTimeFromMonth: z.number().optional(),

  rooms: z.array(RoomBreakdownSchema),

  hardfloor: FloorSectionBreakdownSchema.optional(),
  carpet: FloorSectionBreakdownSchema.optional(),
});
export type PackageOption = z.infer<typeof PackageOptionSchema>;

/** NEW: what the user selected (key or name). Keep loose to match your UI. */
export const PackageChoiceSchema = z.union([PackageTierSchema, z.string()]);
export type PackageChoice = z.infer<typeof PackageChoiceSchema>;

/** Wrapper stored on the quote record */
export const PackageSetSchema = z.object({
  packageOptions: z.array(PackageOptionSchema),
  /** Optional so old records without a choice still validate */
  packageChoice: z.string().nullable().optional(),
});
export type PackageSet = z.infer<typeof PackageSetSchema>;
