import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "../types/api";

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, error: "Route not found" } satisfies ApiResponse<never>);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ success: false, error: err.message } satisfies ApiResponse<never>);
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" } satisfies ApiResponse<never>);
}
