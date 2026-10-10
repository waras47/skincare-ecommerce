import type { Request, Response } from "express";
import { ordersService } from "./orders.service";
import type { z } from "zod";
import type { listOrdersQuerySchema } from "./orders.schema";

export const ordersController = {
  async checkout(req: Request, res: Response) {
    const order = await ordersService.checkout(req.user!.id, req.body.addressId, req.body.paymentMethod);
    res.status(201).json({ success: true, data: order });
  },

  async listMine(req: Request, res: Response) {
    const orders = await ordersService.listMyOrders(req.user!.id);
    res.json({ success: true, data: orders });
  },

  async getMine(req: Request, res: Response) {
    const order = await ordersService.getMyOrder(req.user!.id, req.params.id as string);
    res.json({ success: true, data: order });
  },

  async listAll(req: Request, res: Response) {
    const result = await ordersService.listAll(req.query as unknown as z.infer<typeof listOrdersQuerySchema>);
    res.json({ success: true, data: result });
  },

  async updateStatus(req: Request, res: Response) {
    const order = await ordersService.updateStatus(req.params.id as string, req.body.status);
    res.json({ success: true, data: order });
  },
};
