import { prisma } from "../../lib/prisma";
import type { OrderStatus } from "@prisma/client";

const REVENUE_STATUSES: OrderStatus[] = ["paid", "shipped", "completed"];

export const dashboardRepository = {
  async getStats() {
    const now = new Date();
    const last7Start = new Date(now.getTime() - 7 * 86400000);
    const prev7Start = new Date(now.getTime() - 14 * 86400000);

    const [
      totalProducts,
      last7Products,
      prev7Products,
      totalOrders,
      last7Orders,
      prev7Orders,
      totalCustomers,
      last7Customers,
      prev7Customers,
      revenueTotal,
      revenueLast7,
      revenuePrev7,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { createdAt: { gte: last7Start } } }),
      prisma.product.count({ where: { createdAt: { gte: prev7Start, lt: last7Start } } }),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: last7Start } } }),
      prisma.order.count({ where: { createdAt: { gte: prev7Start, lt: last7Start } } }),
      prisma.user.count({ where: { role: "customer" } }),
      prisma.user.count({ where: { role: "customer", createdAt: { gte: last7Start } } }),
      prisma.user.count({ where: { role: "customer", createdAt: { gte: prev7Start, lt: last7Start } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { in: REVENUE_STATUSES } } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: REVENUE_STATUSES }, createdAt: { gte: last7Start } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: REVENUE_STATUSES }, createdAt: { gte: prev7Start, lt: last7Start } },
      }),
    ]);

    return {
      products: { total: totalProducts, last7: last7Products, prev7: prev7Products },
      orders: { total: totalOrders, last7: last7Orders, prev7: prev7Orders },
      customers: { total: totalCustomers, last7: last7Customers, prev7: prev7Customers },
      revenue: {
        total: Number(revenueTotal._sum?.totalAmount ?? 0),
        last7: Number(revenueLast7._sum?.totalAmount ?? 0),
        prev7: Number(revenuePrev7._sum?.totalAmount ?? 0),
      },
    };
  },
};
