import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const productListInclude = {
  category: true,
  images: { where: { isPrimary: true }, take: 1 },
  variants: { select: { price: true, stock: true } },
} satisfies Prisma.ProductInclude;

const productDetailInclude = {
  category: true,
  images: true,
  variants: true,
  reviews: {
    where: { isApproved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.ProductInclude;

export interface ProductFilters {
  categorySlug?: string;
  skinType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit: number;
  offset: number;
}

export const catalogRepository = {
  async listProducts(filters: ProductFilters) {
    const where: Prisma.ProductWhereInput = {
      ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
      ...(filters.search
        ? { name: { contains: filters.search } }
        : {}),
      ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
            basePrice: {
              ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
              ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
            },
          }
        : {}),
    };

    // skin_types is stored as a JSON array; filter in-memory after a narrower DB query
    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productListInclude,
        orderBy: { createdAt: "desc" },
        take: filters.skinType ? undefined : filters.limit,
        skip: filters.skinType ? undefined : filters.offset,
      }),
      prisma.product.count({ where }),
    ]);

    if (!filters.skinType) {
      return { products: rows, total };
    }

    const filtered = rows.filter((p) =>
      Array.isArray(p.skinTypes) && (p.skinTypes as string[]).includes(filters.skinType as string),
    );
    return {
      products: filtered.slice(filters.offset, filters.offset + filters.limit),
      total: filtered.length,
    };
  },

  getProductBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug }, include: productDetailInclude });
  },

  getProductById(id: bigint) {
    return prisma.product.findUnique({ where: { id }, include: productDetailInclude });
  },

  listCategories() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  },

  createCategory(data: { name: string; slug: string }) {
    return prisma.category.create({ data });
  },

  updateCategory(id: bigint, data: Partial<{ name: string; slug: string }>) {
    return prisma.category.update({ where: { id }, data });
  },

  deleteCategory(id: bigint) {
    return prisma.category.delete({ where: { id } });
  },

  createProduct(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data, include: productDetailInclude });
  },

  updateProduct(id: bigint, data: Prisma.ProductUncheckedUpdateInput) {
    return prisma.product.update({ where: { id }, data, include: productDetailInclude });
  },

  deleteProduct(id: bigint) {
    return prisma.product.delete({ where: { id } });
  },

  createVariant(productId: bigint, data: { variantName: string; sku: string; price: number; stock: number }) {
    return prisma.productVariant.create({ data: { ...data, productId } });
  },

  updateVariant(id: bigint, data: Partial<{ variantName: string; sku: string; price: number; stock: number }>) {
    return prisma.productVariant.update({ where: { id }, data });
  },

  deleteVariant(id: bigint) {
    return prisma.productVariant.delete({ where: { id } });
  },

  createImage(productId: bigint, data: { url: string; isPrimary: boolean }) {
    return prisma.productImage.create({ data: { ...data, productId } });
  },

  deleteImage(id: bigint) {
    return prisma.productImage.delete({ where: { id } });
  },
};
