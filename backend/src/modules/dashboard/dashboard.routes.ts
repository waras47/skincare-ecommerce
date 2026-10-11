import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth";

export const adminDashboardRouter = Router();
adminDashboardRouter.use(authenticate, requireRole("admin"));
adminDashboardRouter.get("/", asyncHandler(dashboardController.getStats));
