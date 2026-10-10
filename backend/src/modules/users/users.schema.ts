import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  skinType: z.string().min(1).max(50).optional(),
});

export const addressSchema = z.object({
  label: z.string().min(1).max(50),
  recipient: z.string().min(1).max(100),
  phone: z.string().min(5).max(30),
  fullAddress: z.string().min(1),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = addressSchema.partial();
