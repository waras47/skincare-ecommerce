import type { Request, Response } from "express";
import { authService } from "./auth.service";
import type { ApiResponse } from "../../types/api";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result } satisfies ApiResponse<typeof result>);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result } satisfies ApiResponse<typeof result>);
  },
};
