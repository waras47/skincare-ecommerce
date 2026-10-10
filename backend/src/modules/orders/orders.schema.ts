import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string(),
  paymentMethod: z.string().min(1).max(50),
});

export const updateStatusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "completed", "cancelled", "failed"]),
});

export const listOrdersQuerySchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "completed", "cancelled", "failed"]).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
