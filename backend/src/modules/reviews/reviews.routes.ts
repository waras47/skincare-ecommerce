import { Router } from "express";
import { reviewsController } from "./reviews.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { createReviewSchema, setApprovedSchema } from "./reviews.schema";

export const reviewsRouter = Router();
reviewsRouter.get("/product/:productId", asyncHandler(reviewsController.listByProduct));
reviewsRouter.post("/", authenticate, validateBody(createReviewSchema), asyncHandler(reviewsController.create));

export const adminReviewsRouter = Router();
adminReviewsRouter.use(authenticate, requireRole("admin"));
adminReviewsRouter.get("/", asyncHandler(reviewsController.listAll));
adminReviewsRouter.patch("/:id/approve", validateBody(setApprovedSchema), asyncHandler(reviewsController.setApproved));
adminReviewsRouter.delete("/:id", asyncHandler(reviewsController.delete));
