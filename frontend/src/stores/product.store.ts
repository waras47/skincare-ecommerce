import { defineStore } from "pinia";
import { ref } from "vue";
import { catalogApi, type ProductListParams } from "@/api/endpoints/catalog.api";
import type { Category, Product } from "@/types";

export const useProductStore = defineStore("product", () => {
  const products = ref<Product[]>([]);
  const total = ref(0);
  const categories = ref<Category[]>([]);
  const current = ref<Product | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts(params: ProductListParams = {}) {
    isLoading.value = true;
    const result = await catalogApi.listProducts(params);
    isLoading.value = false;
    if (result.ok) {
      products.value = result.data.products;
      total.value = result.data.total;
    } else {
      error.value = result.error;
    }
  }

  async function fetchCategories() {
    const result = await catalogApi.listCategories();
    if (result.ok) categories.value = result.data;
  }

  async function fetchProduct(slug: string) {
    isLoading.value = true;
    const result = await catalogApi.getProduct(slug);
    isLoading.value = false;
    if (result.ok) current.value = result.data;
    else error.value = result.error;
  }

  return { products, total, categories, current, isLoading, error, fetchProducts, fetchCategories, fetchProduct };
});
