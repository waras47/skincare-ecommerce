import { client, safeRequest } from "../client";
import type { Order, OrderStatus } from "@/types";

export const ordersApi = {
  checkout: (addressId: string, paymentMethod: string) =>
    safeRequest<Order>(() => client.post("/orders/checkout", { addressId, paymentMethod })),

  listMine: () => safeRequest<Order[]>(() => client.get("/orders")),

  getMine: (id: string) => safeRequest<Order>(() => client.get(`/orders/${id}`)),

  // admin
  listAll: (params: { status?: OrderStatus; limit?: number; offset?: number } = {}) =>
    safeRequest<{ orders: Order[]; total: number }>(() => client.get("/admin/orders", { params })),

  updateStatus: (id: string, status: OrderStatus) =>
    safeRequest<Order>(() => client.patch(`/admin/orders/${id}/status`, { status })),
};
