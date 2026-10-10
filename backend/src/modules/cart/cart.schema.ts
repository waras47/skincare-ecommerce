import { z } from "zod";

export const addItemSchema = z.object({
  variantId: z.string(),
  qty: z.coerce.number().int().min(1).default(1),
});

export const updateItemSchema = z.object({
  qty: z.coerce.number().int().min(1),
});
