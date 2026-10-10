import { prisma } from "../../lib/prisma";

const cartInclude = {
  items: {
    include: {
      variant: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
    },
  },
} as const;

export const cartRepository = {
  async getOrCreateCart(userId: bigint) {
    const existing = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });
    if (existing) return existing;
    return prisma.cart.create({ data: { userId }, include: cartInclude });
  },

  findVariant(variantId: bigint) {
    return prisma.productVariant.findUnique({ where: { id: variantId } });
  },

  findItem(cartId: bigint, variantId: bigint) {
    return prisma.cartItem.findUnique({ where: { cartId_variantId: { cartId, variantId } } });
  },

  upsertItem(cartId: bigint, variantId: bigint, qty: number) {
    return prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId, variantId } },
      create: { cartId, variantId, qty },
      update: { qty },
    });
  },

  updateItemQty(itemId: bigint, qty: number) {
    return prisma.cartItem.update({ where: { id: itemId }, data: { qty } });
  },

  removeItem(itemId: bigint) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  },

  findItemById(itemId: bigint) {
    return prisma.cartItem.findUnique({ where: { id: itemId } });
  },

  clearCart(cartId: bigint) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  },
};
