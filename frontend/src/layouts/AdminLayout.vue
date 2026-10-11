<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { ordersApi } from "@/api/endpoints/orders.api";

const auth = useAuthStore();
const router = useRouter();
const pendingOrders = ref(0);

onMounted(async () => {
  const res = await ordersApi.listAll({ status: "pending", limit: 1 });
  if (res.ok) pendingOrders.value = res.data.total;
});

function logout() {
  auth.logout();
  router.push("/login");
}

const links: { to: string; label: string; icon: string; badge?: boolean }[] = [
  { to: "/admin/products", label: "Produk", icon: "box" },
  { to: "/admin/categories", label: "Kategori", icon: "tag" },
  { to: "/admin/skin-quiz", label: "Skin Quiz", icon: "clipboard" },
  { to: "/admin/orders", label: "Order", icon: "cart", badge: true },
  { to: "/admin/users", label: "User", icon: "users" },
  { to: "/admin/reviews", label: "Review", icon: "star" },
];

const icons: Record<string, string> = {
  box: "M20 7L12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  tag: "M7 7h.01M3 11V5a2 2 0 0 1 2-2h6l10 10a2 2 0 0 1 0 2.83l-7.17 7.17a2 2 0 0 1-2.83 0L3 14.83A2 2 0 0 1 3 11Z",
  clipboard: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-5 8 2 2 4-4",
  cart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293A1 1 0 0 0 5.414 17H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  users: "M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m5-4.13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 3.13a4 4 0 0 1 0 7.75M9 11.13a4 4 0 0 0 0 7.75",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z",
};
</script>

<template>
  <div class="min-h-screen flex bg-gray-50">
    <aside class="w-60 bg-white border-r shrink-0 flex flex-col">
      <router-link to="/" class="block font-bold text-brand-600 px-5 py-5 border-b">Skincare.co Admin</router-link>

      <nav class="flex-1 px-3 py-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-2">Main</p>
        <div class="flex flex-col gap-1">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center justify-between gap-2 px-3 py-2 rounded text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700"
            active-class="bg-brand-50 text-brand-700 font-medium"
          >
            <span class="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                <path :d="icons[link.icon]" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ link.label }}
            </span>
            <span
              v-if="link.badge && pendingOrders > 0"
              class="text-xs bg-brand-600 text-white rounded-full px-1.5 min-w-[18px] text-center"
            >
              {{ pendingOrders }}
            </span>
          </router-link>
        </div>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b h-16 flex items-center justify-end px-6 gap-4">
        <div class="text-right">
          <p class="text-sm font-medium">{{ auth.user?.name }}</p>
          <p class="text-xs text-gray-400">Admin</p>
        </div>
        <div class="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
          {{ auth.user?.name?.[0]?.toUpperCase() }}
        </div>
        <button class="text-sm text-gray-500 hover:text-brand-600" @click="logout">Keluar</button>
      </header>

      <main class="flex-1 p-6 overflow-x-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
