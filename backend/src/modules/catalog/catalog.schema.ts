import { z } from "zod";

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  skinType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(120),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProductSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(220),
  description: z.string().min(1),
  ingredients: z.string().min(1),
  skinTypes: z.array(z.string()).min(1),
  basePrice: z.number().positive(),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  variantName: z.string().min(1).max(100),
  sku: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.coerce.number().int().min(0).default(0),
});

export const updateVariantSchema = createVariantSchema.partial();

export const createImageSchema = z.object({
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
});
