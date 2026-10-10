import { Router } from "express";
import { usersController } from "./users.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { addressSchema, updateAddressSchema, updateProfileSchema } from "./users.schema";

export const usersRouter = Router();
usersRouter.use(authenticate);

usersRouter.get("/me", asyncHandler(usersController.getProfile));
usersRouter.patch("/me", validateBody(updateProfileSchema), asyncHandler(usersController.updateProfile));
usersRouter.get("/me/addresses", asyncHandler(usersController.listAddresses));
usersRouter.post("/me/addresses", validateBody(addressSchema), asyncHandler(usersController.createAddress));
usersRouter.patch("/me/addresses/:id", validateBody(updateAddressSchema), asyncHandler(usersController.updateAddress));
usersRouter.delete("/me/addresses/:id", asyncHandler(usersController.deleteAddress));

export const adminUsersRouter = Router();
adminUsersRouter.get("/", authenticate, requireRole("admin"), asyncHandler(usersController.listCustomers));
