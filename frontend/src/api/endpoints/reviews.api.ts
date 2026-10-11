import { client, safeRequest } from "../client";
import type { RecentReview, Review } from "@/types";

export const reviewsApi = {
  listByProduct: (productId: string) => safeRequest<Review[]>(() => client.get(`/reviews/product/${productId}`)),

  listRecent: (limit = 6) => safeRequest<RecentReview[]>(() => client.get("/reviews/recent", { params: { limit } })),

  create: (data: { orderItemId: string; rating: number; comment: string }) =>
    safeRequest<Review>(() => client.post("/reviews", data)),

  // admin
  listAll: () => safeRequest<Review[]>(() => client.get("/admin/reviews")),
  setApproved: (id: string, isApproved: boolean) =>
    safeRequest<Review>(() => client.patch(`/admin/reviews/${id}/approve`, { isApproved })),
  remove: (id: string) => safeRequest<null>(() => client.delete(`/admin/reviews/${id}`)),
};
