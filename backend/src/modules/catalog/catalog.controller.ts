import type { Request, Response } from "express";
import { catalogService } from "./catalog.service";
import type { z } from "zod";
import type { listProductsQuerySchema } from "./catalog.schema";

export const catalogController = {
  async listProducts(req: Request, res: Response) {
    const result = await catalogService.listProducts(req.query as unknown as z.infer<typeof listProductsQuerySchema>);
    res.json({ success: true, data: result });
  },

  async listTrending(req: Request, res: Response) {
    const limit = Math.min(Number(req.query.limit) || 8, 20);
    const products = await catalogService.listTrending(limit);
    res.json({ success: true, data: products });
  },

  async getProduct(req: Request, res: Response) {
    const product = await catalogService.getProductBySlug(req.params.slug as string);
    res.json({ success: true, data: product });
  },

  async listCategories(_req: Request, res: Response) {
    const categories = await catalogService.listCategories();
    res.json({ success: true, data: categories });
  },

  async listAllForAdmin(_req: Request, res: Response) {
    const products = await catalogService.listAllForAdmin();
    res.json({ success: true, data: products });
  },

  async createCategory(req: Request, res: Response) {
    const category = await catalogService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  },

  async updateCategory(req: Request, res: Response) {
    const category = await catalogService.updateCategory(req.params.id as string, req.body);
    res.json({ success: true, data: category });
  },

  async deleteCategory(req: Request, res: Response) {
    await catalogService.deleteCategory(req.params.id as string);
    res.status(204).send();
  },

  async createProduct(req: Request, res: Response) {
    const product = await catalogService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  },

  async updateProduct(req: Request, res: Response) {
    const product = await catalogService.updateProduct(req.params.id as string, req.body);
    res.json({ success: true, data: product });
  },

  async deleteProduct(req: Request, res: Response) {
    await catalogService.deleteProduct(req.params.id as string);
    res.status(204).send();
  },

  async createVariant(req: Request, res: Response) {
    const variant = await catalogService.createVariant(req.params.productId as string, req.body);
    res.status(201).json({ success: true, data: variant });
  },

  async updateVariant(req: Request, res: Response) {
    const variant = await catalogService.updateVariant(req.params.id as string, req.body);
    res.json({ success: true, data: variant });
  },

  async deleteVariant(req: Request, res: Response) {
    await catalogService.deleteVariant(req.params.id as string);
    res.status(204).send();
  },

  async createImage(req: Request, res: Response) {
    const image = await catalogService.createImage(req.params.productId as string, req.body);
    res.status(201).json({ success: true, data: image });
  },

  async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No image file uploaded" });
      return;
    }
    const isPrimary = req.body.isPrimary === "true";
    const image = await catalogService.uploadImage(req.params.productId as string, req.file.buffer, isPrimary);
    res.status(201).json({ success: true, data: image });
  },

  async deleteImage(req: Request, res: Response) {
    await catalogService.deleteImage(req.params.id as string);
    res.status(204).send();
  },
};
