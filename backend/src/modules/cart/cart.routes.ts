import { Router } from "express";
import { cartController } from "./cart.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { addItemSchema, updateItemSchema } from "./cart.schema";

export const cartRouter = Router();
cartRouter.use(authenticate);

cartRouter.get("/", asyncHandler(cartController.getCart));
cartRouter.post("/items", validateBody(addItemSchema), asyncHandler(cartController.addItem));
cartRouter.patch("/items/:itemId", validateBody(updateItemSchema), asyncHandler(cartController.updateItem));
cartRouter.delete("/items/:itemId", asyncHandler(cartController.removeItem));
