import { client, safeRequest } from "../client";
import type { Product } from "@/types";

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export const wishlistApi = {
  list: () => safeRequest<WishlistItem[]>(() => client.get("/wishlist")),
  add: (productId: string) => safeRequest<WishlistItem>(() => client.post("/wishlist", { productId })),
  remove: (productId: string) => safeRequest<null>(() => client.delete(`/wishlist/${productId}`)),
};
