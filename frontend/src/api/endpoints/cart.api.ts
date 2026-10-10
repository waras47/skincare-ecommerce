import { client, safeRequest } from "../client";
import type { Cart } from "@/types";

export const cartApi = {
  getCart: () => safeRequest<Cart>(() => client.get("/cart")),
  addItem: (variantId: string, qty = 1) => safeRequest<Cart>(() => client.post("/cart/items", { variantId, qty })),
  updateItem: (itemId: string, qty: number) => safeRequest<Cart>(() => client.patch(`/cart/items/${itemId}`, { qty })),
  removeItem: (itemId: string) => safeRequest<Cart>(() => client.delete(`/cart/items/${itemId}`)),
};
