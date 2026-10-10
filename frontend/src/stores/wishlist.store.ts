import { defineStore } from "pinia";
import { ref } from "vue";
import { wishlistApi } from "@/api/endpoints/wishlist.api";
import type { Product } from "@/types";

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export const useWishlistStore = defineStore("wishlist", () => {
  const items = ref<WishlistItem[]>([]);

  function isWishlisted(productId: string): boolean {
    return items.value.some((i) => i.productId === productId);
  }

  async function fetch() {
    const res = await wishlistApi.list();
    if (res.ok) items.value = res.data;
  }

  async function add(productId: string) {
    const res = await wishlistApi.add(productId);
    if (res.ok) await fetch();
  }

  async function remove(productId: string) {
    const res = await wishlistApi.remove(productId);
    if (res.ok) items.value = items.value.filter((i) => i.productId !== productId);
  }

  return { items, isWishlisted, fetch, add, remove };
});
