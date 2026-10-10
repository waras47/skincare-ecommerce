import { client, safeRequest } from "../client";
import type { Category, Product } from "@/types";

export interface ProductListParams {
  category?: string;
  skinType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProductListResult {
  products: Product[];
  total: number;
}

export const catalogApi = {
  listProducts: (params: ProductListParams = {}) =>
    safeRequest<ProductListResult>(() => client.get("/products", { params })),

  getProduct: (slug: string) => safeRequest<Product>(() => client.get(`/products/${slug}`)),

  listCategories: () => safeRequest<Category[]>(() => client.get("/categories")),

  // admin
  createCategory: (data: { name: string; slug: string }) =>
    safeRequest<Category>(() => client.post("/admin/categories", data)),
  updateCategory: (id: string, data: Partial<{ name: string; slug: string }>) =>
    safeRequest<Category>(() => client.patch(`/admin/categories/${id}`, data)),
  deleteCategory: (id: string) => safeRequest<null>(() => client.delete(`/admin/categories/${id}`)),

  createProduct: (data: {
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    ingredients: string;
    skinTypes: string[];
    basePrice: number;
  }) => safeRequest<Product>(() => client.post("/admin/products", data)),
  updateProduct: (id: string, data: Record<string, unknown>) =>
    safeRequest<Product>(() => client.patch(`/admin/products/${id}`, data)),
  deleteProduct: (id: string) => safeRequest<null>(() => client.delete(`/admin/products/${id}`)),

  addVariant: (productId: string, data: { variantName: string; sku: string; price: number; stock: number }) =>
    safeRequest(() => client.post(`/admin/products/${productId}/variants`, data)),
  updateVariant: (id: string, data: Record<string, unknown>) =>
    safeRequest(() => client.patch(`/admin/products/variants/${id}`, data)),
  deleteVariant: (id: string) => safeRequest<null>(() => client.delete(`/admin/products/variants/${id}`)),

  addImage: (productId: string, data: { url: string; isPrimary: boolean }) =>
    safeRequest(() => client.post(`/admin/products/${productId}/images`, data)),
  uploadImage: (productId: string, file: File, isPrimary = false) => {
    const form = new FormData();
    form.append("image", file);
    form.append("isPrimary", String(isPrimary));
    return safeRequest(() => client.post(`/admin/products/${productId}/images/upload`, form));
  },
  deleteImage: (id: string) => safeRequest<null>(() => client.delete(`/admin/products/images/${id}`)),
};
