import { z } from "zod";

export const createReviewSchema = z.object({
  orderItemId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});

export const setApprovedSchema = z.object({
  isApproved: z.boolean(),
});
