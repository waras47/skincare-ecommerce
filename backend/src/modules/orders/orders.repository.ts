import { prisma } from "../../lib/prisma";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

const orderInclude = {
  items: { include: { variant: { include: { product: true } } } },
  payment: true,
  address: true,
} as const;

export interface OrderItemInput {
  variantId: bigint;
  qty: number;
  price: number;
}

export const ordersRepository = {
  async createOrder(userId: bigint, addressId: bigint, items: OrderItemInput[], totalAmount: number) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          status: "pending",
          items: { create: items.map((i) => ({ variantId: i.variantId, qty: i.qty, price: i.price })) },
        },
        include: orderInclude,
      });

      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.qty } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cart: { userId } } });

      return order;
    });
  },

  async recordPayment(orderId: bigint, method: string, status: PaymentStatus) {
    await prisma.payment.create({
      data: { orderId, method, status, paidAt: status === "success" ? new Date() : null },
    });
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status === "success" ? "paid" : "failed" },
      include: orderInclude,
    });
  },

  listByUser(userId: bigint) {
    return prisma.order.findMany({ where: { userId }, include: orderInclude, orderBy: { createdAt: "desc" } });
  },

  findById(id: bigint) {
    return prisma.order.findUnique({ where: { id }, include: orderInclude });
  },

  async listAll(filters: { status?: OrderStatus; limit: number; offset: number }) {
    const where = filters.status ? { status: filters.status } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { ...orderInclude, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: filters.limit,
        skip: filters.offset,
      }),
      prisma.order.count({ where }),
    ]);
    return { orders, total };
  },

  updateStatus(id: bigint, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
  },
};
