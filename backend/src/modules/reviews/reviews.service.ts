import { AppError } from "../../middleware/errorHandler";
import { reviewsRepository } from "./reviews.repository";

export const reviewsService = {
  async create(userId: string, input: { orderItemId: string; rating: number; comment: string }) {
    const orderItem = await reviewsRepository.findOrderItemWithOrder(BigInt(input.orderItemId));
    if (!orderItem || orderItem.order.userId.toString() !== userId) {
      throw new AppError(404, "Order item not found");
    }
    if (orderItem.order.status !== "completed") {
      throw new AppError(400, "You can only review products from completed orders");
    }
    if (orderItem.review) {
      throw new AppError(409, "This item has already been reviewed");
    }

    return reviewsRepository.create({
      productId: orderItem.variant.productId,
      userId: BigInt(userId),
      orderItemId: orderItem.id,
      rating: input.rating,
      comment: input.comment,
    });
  },

  listByProduct(productId: string) {
    return reviewsRepository.listByProduct(BigInt(productId));
  },

  listAll() {
    return reviewsRepository.listAll();
  },

  setApproved(id: string, isApproved: boolean) {
    return reviewsRepository.setApproved(BigInt(id), isApproved);
  },

  delete(id: string) {
    return reviewsRepository.delete(BigInt(id));
  },
};
