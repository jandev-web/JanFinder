// types/address.ts
import { z } from 'zod';

export const AddressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
