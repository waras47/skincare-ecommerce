import { AppError } from "../../middleware/errorHandler";
import { cartRepository } from "./cart.repository";

export const cartService = {
  getCart(userId: string) {
    return cartRepository.getOrCreateCart(BigInt(userId));
  },

  async addItem(userId: string, variantId: string, qty: number) {
    const variant = await cartRepository.findVariant(BigInt(variantId));
    if (!variant) throw new AppError(404, "Product variant not found");

    const cart = await cartRepository.getOrCreateCart(BigInt(userId));
    const existing = await cartRepository.findItem(cart.id, variant.id);
    const nextQty = Math.min((existing?.qty ?? 0) + qty, variant.stock);
    if (nextQty < 1) throw new AppError(400, "Product out of stock");

    await cartRepository.upsertItem(cart.id, variant.id, nextQty);
    return cartRepository.getOrCreateCart(BigInt(userId));
  },

  async updateItem(userId: string, itemId: string, qty: number) {
    const item = await cartRepository.findItemById(BigInt(itemId));
    if (!item) throw new AppError(404, "Cart item not found");

    const variant = await cartRepository.findVariant(item.variantId);
    if (!variant) throw new AppError(404, "Product variant not found");

    await cartRepository.updateItemQty(item.id, Math.min(qty, variant.stock));
    return cartRepository.getOrCreateCart(BigInt(userId));
  },

  async removeItem(userId: string, itemId: string) {
    await cartRepository.removeItem(BigInt(itemId));
    return cartRepository.getOrCreateCart(BigInt(userId));
  },
};
