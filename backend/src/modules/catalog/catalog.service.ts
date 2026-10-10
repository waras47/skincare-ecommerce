import { AppError } from "../../middleware/errorHandler";
import { cloudinaryConfigured, uploadImageBuffer } from "../../lib/cloudinary";
import { catalogRepository } from "./catalog.repository";

export const catalogService = {
  listProducts(filters: {
    category?: string;
    skinType?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit: number;
    offset: number;
  }) {
    return catalogRepository.listProducts({
      categorySlug: filters.category,
      skinType: filters.skinType,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      limit: filters.limit,
      offset: filters.offset,
    });
  },

  async getProductBySlug(slug: string) {
    const product = await catalogRepository.getProductBySlug(slug);
    if (!product) throw new AppError(404, "Product not found");
    return product;
  },

  listCategories() {
    return catalogRepository.listCategories();
  },

  createCategory(data: { name: string; slug: string }) {
    return catalogRepository.createCategory(data);
  },

  updateCategory(id: string, data: Partial<{ name: string; slug: string }>) {
    return catalogRepository.updateCategory(BigInt(id), data);
  },

  deleteCategory(id: string) {
    return catalogRepository.deleteCategory(BigInt(id));
  },

  createProduct(data: {
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    ingredients: string;
    skinTypes: string[];
    basePrice: number;
  }) {
    return catalogRepository.createProduct({
      ...data,
      categoryId: BigInt(data.categoryId),
      skinTypes: data.skinTypes,
    });
  },

  async updateProduct(
    id: string,
    data: Partial<{
      categoryId: string;
      name: string;
      slug: string;
      description: string;
      ingredients: string;
      skinTypes: string[];
      basePrice: number;
    }>,
  ) {
    const { categoryId, ...rest } = data;
    return catalogRepository.updateProduct(BigInt(id), {
      ...rest,
      ...(categoryId ? { categoryId: BigInt(categoryId) } : {}),
    });
  },

  deleteProduct(id: string) {
    return catalogRepository.deleteProduct(BigInt(id));
  },

  createVariant(productId: string, data: { variantName: string; sku: string; price: number; stock: number }) {
    return catalogRepository.createVariant(BigInt(productId), data);
  },

  updateVariant(id: string, data: Partial<{ variantName: string; sku: string; price: number; stock: number }>) {
    return catalogRepository.updateVariant(BigInt(id), data);
  },

  deleteVariant(id: string) {
    return catalogRepository.deleteVariant(BigInt(id));
  },

  createImage(productId: string, data: { url: string; isPrimary: boolean }) {
    return catalogRepository.createImage(BigInt(productId), data);
  },

  async uploadImage(productId: string, buffer: Buffer, isPrimary: boolean) {
    if (!cloudinaryConfigured) {
      throw new AppError(501, "Image upload not configured — set CLOUDINARY_* env vars");
    }
    const url = await uploadImageBuffer(buffer);
    return catalogRepository.createImage(BigInt(productId), { url, isPrimary });
  },

  deleteImage(id: string) {
    return catalogRepository.deleteImage(BigInt(id));
  },
};
