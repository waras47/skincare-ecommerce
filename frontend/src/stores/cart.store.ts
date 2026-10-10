import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { cartApi } from "@/api/endpoints/cart.api";
import type { Cart } from "@/types";

export const useCartStore = defineStore("cart", () => {
  const cart = ref<Cart | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const itemCount = computed(() => cart.value?.items.reduce((sum, i) => sum + i.qty, 0) ?? 0);
  const subtotal = computed(
    () => cart.value?.items.reduce((sum, i) => sum + Number(i.variant.price) * i.qty, 0) ?? 0,
  );

  async function fetchCart() {
    isLoading.value = true;
    const result = await cartApi.getCart();
    isLoading.value = false;
    if (result.ok) cart.value = result.data;
    else error.value = result.error;
  }

  async function addItem(variantId: string, qty = 1): Promise<boolean> {
    const result = await cartApi.addItem(variantId, qty);
    if (result.ok) {
      cart.value = result.data;
      return true;
    }
    error.value = result.error;
    return false;
  }

  async function updateItem(itemId: string, qty: number) {
    const result = await cartApi.updateItem(itemId, qty);
    if (result.ok) cart.value = result.data;
    else error.value = result.error;
  }

  async function removeItem(itemId: string) {
    const result = await cartApi.removeItem(itemId);
    if (result.ok) cart.value = result.data;
    else error.value = result.error;
  }

  function clearLocal() {
    cart.value = null;
  }

  return { cart, isLoading, error, itemCount, subtotal, fetchCart, addItem, updateItem, removeItem, clearLocal };
});
