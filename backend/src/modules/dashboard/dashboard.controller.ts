import type { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

export const dashboardController = {
  async getStats(_req: Request, res: Response) {
    const stats = await dashboardService.getStats();
    res.json({ success: true, data: stats });
  },
};
