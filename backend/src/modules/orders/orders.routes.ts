import { Router } from "express";
import { ordersController } from "./orders.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth";
import { validateBody, validateQuery } from "../../middleware/validate";
import { checkoutSchema, listOrdersQuerySchema, updateStatusSchema } from "./orders.schema";

export const ordersRouter = Router();
ordersRouter.use(authenticate);
ordersRouter.post("/checkout", validateBody(checkoutSchema), asyncHandler(ordersController.checkout));
ordersRouter.get("/", asyncHandler(ordersController.listMine));
ordersRouter.get("/:id", asyncHandler(ordersController.getMine));

export const adminOrdersRouter = Router();
adminOrdersRouter.use(authenticate, requireRole("admin"));
adminOrdersRouter.get("/", validateQuery(listOrdersQuerySchema), asyncHandler(ordersController.listAll));
adminOrdersRouter.patch("/:id/status", validateBody(updateStatusSchema), asyncHandler(ordersController.updateStatus));
