import type { Request, Response } from "express";
import { cartService } from "./cart.service";

export const cartController = {
  async getCart(req: Request, res: Response) {
    const cart = await cartService.getCart(req.user!.id);
    res.json({ success: true, data: cart });
  },

  async addItem(req: Request, res: Response) {
    const cart = await cartService.addItem(req.user!.id, req.body.variantId, req.body.qty);
    res.status(201).json({ success: true, data: cart });
  },

  async updateItem(req: Request, res: Response) {
    const cart = await cartService.updateItem(req.user!.id, req.params.itemId as string, req.body.qty);
    res.json({ success: true, data: cart });
  },

  async removeItem(req: Request, res: Response) {
    const cart = await cartService.removeItem(req.user!.id, req.params.itemId as string);
    res.json({ success: true, data: cart });
  },
};
