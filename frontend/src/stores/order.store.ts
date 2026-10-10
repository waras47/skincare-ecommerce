import { defineStore } from "pinia";
import { ref } from "vue";
import { ordersApi } from "@/api/endpoints/orders.api";
import type { Order } from "@/types";

export const useOrderStore = defineStore("order", () => {
  const orders = ref<Order[]>([]);
  const current = ref<Order | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function checkout(addressId: string, paymentMethod: string): Promise<Order | null> {
    isLoading.value = true;
    const res = await ordersApi.checkout(addressId, paymentMethod);
    isLoading.value = false;
    if (res.ok) {
      current.value = res.data;
      return res.data;
    }
    error.value = res.error;
    return null;
  }

  async function fetchOrders() {
    isLoading.value = true;
    const res = await ordersApi.listMine();
    isLoading.value = false;
    if (res.ok) orders.value = res.data;
    else error.value = res.error;
  }

  async function fetchOrder(id: string) {
    isLoading.value = true;
    const res = await ordersApi.getMine(id);
    isLoading.value = false;
    if (res.ok) current.value = res.data;
    else error.value = res.error;
  }

  return { orders, current, isLoading, error, checkout, fetchOrders, fetchOrder };
});
