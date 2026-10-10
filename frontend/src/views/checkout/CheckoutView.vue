<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart.store";
import { useOrderStore } from "@/stores/order.store";
import { usersApi } from "@/api/endpoints/users.api";
import { formatRupiah } from "@/composables/format";
import type { Address } from "@/types";

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const addresses = ref<Address[]>([]);
const selectedAddressId = ref<string | null>(null);
const paymentMethod = ref("dummy-va");
const showNewAddress = ref(false);
const isSubmitting = ref(false);
const feedback = ref<string | null>(null);

const newAddress = reactive({
  label: "Rumah",
  recipient: "",
  phone: "",
  fullAddress: "",
  city: "",
  postalCode: "",
  isDefault: false,
});

async function loadAddresses() {
  const res = await usersApi.listAddresses();
  if (res.ok) {
    addresses.value = res.data;
    selectedAddressId.value = res.data.find((a) => a.isDefault)?.id ?? res.data[0]?.id ?? null;
    showNewAddress.value = res.data.length === 0;
  }
}

onMounted(() => {
  cartStore.fetchCart();
  loadAddresses();
});

async function saveAddress() {
  const res = await usersApi.createAddress(newAddress);
  if (res.ok) {
    addresses.value.push(res.data);
    selectedAddressId.value = res.data.id;
    showNewAddress.value = false;
  } else {
    feedback.value = res.error;
  }
}

async function submitOrder() {
  if (!selectedAddressId.value) {
    feedback.value = "Pilih alamat pengiriman dulu.";
    return;
  }
  isSubmitting.value = true;
  const order = await orderStore.checkout(selectedAddressId.value, paymentMethod.value);
  isSubmitting.value = false;
  if (order) {
    cartStore.clearLocal();
    router.push({ name: "order-detail", params: { id: order.id } });
  } else {
    feedback.value = orderStore.error;
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold mb-6">Checkout</h1>

    <section class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <h2 class="font-medium mb-3">Alamat Pengiriman</h2>
      <div v-for="address in addresses" :key="address.id" class="flex items-start gap-2 mb-2 text-sm">
        <input v-model="selectedAddressId" type="radio" :value="address.id" class="mt-1" />
        <div>
          <p class="font-medium">{{ address.label }} &middot; {{ address.recipient }}</p>
          <p class="text-gray-500">{{ address.fullAddress }}, {{ address.city }} {{ address.postalCode }}</p>
        </div>
      </div>

      <button class="text-rose-600 text-sm mt-2" @click="showNewAddress = !showNewAddress">
        + Tambah alamat baru
      </button>

      <form v-if="showNewAddress" class="grid grid-cols-2 gap-2 mt-3" @submit.prevent="saveAddress">
        <input v-model="newAddress.label" placeholder="Label (rumah/kantor)" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <input v-model="newAddress.recipient" placeholder="Nama penerima" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <input v-model="newAddress.phone" placeholder="No. HP" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <textarea v-model="newAddress.fullAddress" placeholder="Alamat lengkap" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <input v-model="newAddress.city" placeholder="Kota" class="border rounded px-3 py-2 text-sm" required />
        <input v-model="newAddress.postalCode" placeholder="Kode pos" class="border rounded px-3 py-2 text-sm" required />
        <button type="submit" class="col-span-2 bg-gray-800 text-white rounded py-2 text-sm">Simpan alamat</button>
      </form>
    </section>

    <section class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <h2 class="font-medium mb-3">Metode Pembayaran (dummy)</h2>
      <label class="flex items-center gap-2 text-sm mb-2">
        <input v-model="paymentMethod" type="radio" value="dummy-va" /> Virtual Account (dummy, selalu berhasil)
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="paymentMethod" type="radio" value="dummy-fail" /> Simulasikan pembayaran gagal
      </label>
    </section>

    <section class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <h2 class="font-medium mb-3">Ringkasan</h2>
      <div class="flex justify-between text-sm font-medium">
        <span>Total</span>
        <span class="text-rose-600">{{ formatRupiah(cartStore.subtotal) }}</span>
      </div>
    </section>

    <p v-if="feedback" class="text-sm text-red-600 mb-3">{{ feedback }}</p>

    <button
      :disabled="isSubmitting || !cartStore.cart?.items.length"
      class="w-full bg-rose-600 text-white rounded py-3 font-medium disabled:opacity-50"
      @click="submitOrder"
    >
      {{ isSubmitting ? "Memproses..." : "Bayar Sekarang" }}
    </button>
  </div>
</template>
