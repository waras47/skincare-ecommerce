import type { Request, Response } from "express";
import { wishlistService } from "./wishlist.service";

export const wishlistController = {
  async list(req: Request, res: Response) {
    const items = await wishlistService.list(req.user!.id);
    res.json({ success: true, data: items });
  },

  async add(req: Request, res: Response) {
    const item = await wishlistService.add(req.user!.id, req.body.productId);
    res.status(201).json({ success: true, data: item });
  },

  async remove(req: Request, res: Response) {
    await wishlistService.remove(req.user!.id, req.params.productId as string);
    res.status(204).send();
  },
};
