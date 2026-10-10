import { Router } from "express";
import { wishlistController } from "./wishlist.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { addWishlistSchema } from "./wishlist.schema";

export const wishlistRouter = Router();
wishlistRouter.use(authenticate);
wishlistRouter.get("/", asyncHandler(wishlistController.list));
wishlistRouter.post("/", validateBody(addWishlistSchema), asyncHandler(wishlistController.add));
wishlistRouter.delete("/:productId", asyncHandler(wishlistController.remove));
