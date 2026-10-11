import { prisma } from "../../lib/prisma";

export const reviewsRepository = {
  findOrderItemWithOrder(orderItemId: bigint) {
    return prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true, variant: true, review: true },
    });
  },

  create(data: { productId: bigint; userId: bigint; orderItemId: bigint; rating: number; comment: string }) {
    return prisma.review.create({ data, include: { user: { select: { name: true } } } });
  },

  listByProduct(productId: bigint) {
    return prisma.review.findMany({
      where: { productId, isApproved: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  listRecentApproved(limit: number) {
    return prisma.review.findMany({
      where: { isApproved: true },
      include: { user: { select: { name: true } }, product: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  listAll() {
    return prisma.review.findMany({
      include: { user: { select: { name: true } }, product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  setApproved(id: bigint, isApproved: boolean) {
    return prisma.review.update({ where: { id }, data: { isApproved } });
  },

  delete(id: bigint) {
    return prisma.review.delete({ where: { id } });
  },
};
