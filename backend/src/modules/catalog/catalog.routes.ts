import { Router } from "express";
import { catalogController } from "./catalog.controller";
import { asyncHandler } from "../../lib/asyncHandler";
import { imageUpload } from "../../lib/upload";
import { authenticate, requireRole } from "../../middleware/auth";
import { validateBody, validateQuery } from "../../middleware/validate";
import {
  createCategorySchema,
  createImageSchema,
  createProductSchema,
  createVariantSchema,
  listProductsQuerySchema,
  updateCategorySchema,
  updateProductSchema,
  updateVariantSchema,
} from "./catalog.schema";

export const productsRouter = Router();
productsRouter.get("/", validateQuery(listProductsQuerySchema), asyncHandler(catalogController.listProducts));
productsRouter.get("/:slug", asyncHandler(catalogController.getProduct));

export const categoriesRouter = Router();
categoriesRouter.get("/", asyncHandler(catalogController.listCategories));

const adminOnly = [authenticate, requireRole("admin")];

export const adminProductsRouter = Router();
adminProductsRouter.post(
  "/",
  ...adminOnly,
  validateBody(createProductSchema),
  asyncHandler(catalogController.createProduct),
);
adminProductsRouter.patch(
  "/:id",
  ...adminOnly,
  validateBody(updateProductSchema),
  asyncHandler(catalogController.updateProduct),
);
adminProductsRouter.delete("/:id", ...adminOnly, asyncHandler(catalogController.deleteProduct));
adminProductsRouter.post(
  "/:productId/variants",
  ...adminOnly,
  validateBody(createVariantSchema),
  asyncHandler(catalogController.createVariant),
);
adminProductsRouter.patch(
  "/variants/:id",
  ...adminOnly,
  validateBody(updateVariantSchema),
  asyncHandler(catalogController.updateVariant),
);
adminProductsRouter.delete("/variants/:id", ...adminOnly, asyncHandler(catalogController.deleteVariant));
adminProductsRouter.post(
  "/:productId/images",
  ...adminOnly,
  validateBody(createImageSchema),
  asyncHandler(catalogController.createImage),
);
adminProductsRouter.delete("/images/:id", ...adminOnly, asyncHandler(catalogController.deleteImage));
adminProductsRouter.post(
  "/:productId/images/upload",
  ...adminOnly,
  imageUpload.single("image"),
  asyncHandler(catalogController.uploadImage),
);

export const adminCategoriesRouter = Router();
adminCategoriesRouter.post(
  "/",
  ...adminOnly,
  validateBody(createCategorySchema),
  asyncHandler(catalogController.createCategory),
);
adminCategoriesRouter.patch(
  "/:id",
  ...adminOnly,
  validateBody(updateCategorySchema),
  asyncHandler(catalogController.updateCategory),
);
adminCategoriesRouter.delete("/:id", ...adminOnly, asyncHandler(catalogController.deleteCategory));
