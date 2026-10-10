import { AppError } from "../../middleware/errorHandler";
import { cartRepository } from "../cart/cart.repository";
import { usersRepository } from "../users/users.repository";
import { ordersRepository, type OrderItemInput } from "./orders.repository";
import { paymentService } from "./payment.service";
import type { OrderStatus } from "@prisma/client";

export const ordersService = {
  async checkout(userId: string, addressId: string, paymentMethod: string) {
    const address = await usersRepository.findAddress(BigInt(addressId));
    if (!address || address.userId.toString() !== userId) {
      throw new AppError(404, "Address not found");
    }

    const cart = await cartRepository.getOrCreateCart(BigInt(userId));
    if (cart.items.length === 0) {
      throw new AppError(400, "Cart is empty");
    }

    const items: OrderItemInput[] = cart.items.map((item) => ({
      variantId: item.variantId,
      qty: item.qty,
      price: Number(item.variant.price),
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await ordersRepository.createOrder(BigInt(userId), BigInt(addressId), items, totalAmount);
    const payment = await paymentService.process(paymentMethod);
    return ordersRepository.recordPayment(order.id, paymentMethod, payment.status);
  },

  listMyOrders(userId: string) {
    return ordersRepository.listByUser(BigInt(userId));
  },

  async getMyOrder(userId: string, orderId: string) {
    const order = await ordersRepository.findById(BigInt(orderId));
    if (!order || order.userId.toString() !== userId) {
      throw new AppError(404, "Order not found");
    }
    return order;
  },

  listAll(filters: { status?: OrderStatus; limit: number; offset: number }) {
    return ordersRepository.listAll(filters);
  },

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await ordersRepository.findById(BigInt(orderId));
    if (!order) throw new AppError(404, "Order not found");
    return ordersRepository.updateStatus(BigInt(orderId), status);
  },
};
