import type { Request, Response } from "express";
import { reviewsService } from "./reviews.service";

export const reviewsController = {
  async create(req: Request, res: Response) {
    const review = await reviewsService.create(req.user!.id, req.body);
    res.status(201).json({ success: true, data: review });
  },

  async listByProduct(req: Request, res: Response) {
    const reviews = await reviewsService.listByProduct(req.params.productId as string);
    res.json({ success: true, data: reviews });
  },

  async listAll(_req: Request, res: Response) {
    const reviews = await reviewsService.listAll();
    res.json({ success: true, data: reviews });
  },

  async setApproved(req: Request, res: Response) {
    const review = await reviewsService.setApproved(req.params.id as string, req.body.isApproved);
    res.json({ success: true, data: review });
  },

  async delete(req: Request, res: Response) {
    await reviewsService.delete(req.params.id as string);
    res.status(204).send();
  },
};
