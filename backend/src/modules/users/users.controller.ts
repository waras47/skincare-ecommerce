import type { Request, Response } from "express";
import { usersService } from "./users.service";

export const usersController = {
  async getProfile(req: Request, res: Response) {
    const user = await usersService.getProfile(req.user!.id);
    res.json({ success: true, data: user });
  },

  async updateProfile(req: Request, res: Response) {
    const user = await usersService.updateProfile(req.user!.id, req.body);
    res.json({ success: true, data: user });
  },

  async listAddresses(req: Request, res: Response) {
    const addresses = await usersService.listAddresses(req.user!.id);
    res.json({ success: true, data: addresses });
  },

  async createAddress(req: Request, res: Response) {
    const address = await usersService.createAddress(req.user!.id, req.body);
    res.status(201).json({ success: true, data: address });
  },

  async updateAddress(req: Request, res: Response) {
    const address = await usersService.updateAddress(req.user!.id, req.params.id as string, req.body);
    res.json({ success: true, data: address });
  },

  async deleteAddress(req: Request, res: Response) {
    await usersService.deleteAddress(req.user!.id, req.params.id as string);
    res.status(204).send();
  },

  async listCustomers(_req: Request, res: Response) {
    const customers = await usersService.listCustomers();
    res.json({ success: true, data: customers });
  },
};
