import { prisma } from "../../lib/prisma";

export const wishlistRepository = {
  list(userId: bigint) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
  },

  add(userId: bigint, productId: bigint) {
    return prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
  },

  remove(userId: bigint, productId: bigint) {
    return prisma.wishlist.deleteMany({ where: { userId, productId } });
  },
};
