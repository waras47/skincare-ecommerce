import { wishlistRepository } from "./wishlist.repository";

export const wishlistService = {
  list(userId: string) {
    return wishlistRepository.list(BigInt(userId));
  },

  add(userId: string, productId: string) {
    return wishlistRepository.add(BigInt(userId), BigInt(productId));
  },

  remove(userId: string, productId: string) {
    return wishlistRepository.remove(BigInt(userId), BigInt(productId));
  },
};
