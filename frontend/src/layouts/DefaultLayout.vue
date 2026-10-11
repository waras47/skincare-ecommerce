<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { useProductStore } from "@/stores/product.store";
import AppFooter from "@/components/layout/AppFooter.vue";

const auth = useAuthStore();
const cart = useCartStore();
const productStore = useProductStore();
const router = useRouter();
const route = useRoute();

const searchQuery = ref("");
function submitSearch() {
  router.push({ path: "/products", query: searchQuery.value ? { search: searchQuery.value } : {} });
}

const showAccountMenu = ref(false);
const accountMenuRef = ref<HTMLElement | null>(null);

function onClickOutside(event: MouseEvent) {
  if (accountMenuRef.value && !accountMenuRef.value.contains(event.target as Node)) {
    showAccountMenu.value = false;
  }
}

onMounted(() => {
  if (productStore.categories.length === 0) productStore.fetchCategories();
  window.addEventListener("click", onClickOutside);
});
onUnmounted(() => window.removeEventListener("click", onClickOutside));

function logout() {
  auth.logout();
  cart.clearLocal();
  showAccountMenu.value = false;
  router.push("/");
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <header class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <form class="hidden sm:flex items-center max-w-xs col-start-1" @submit.prevent="submitSearch">
          <div class="relative w-full">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" stroke-linecap="round" />
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Cari produk..."
              class="w-full border rounded-full pl-8 pr-3 py-1.5 text-sm"
            />
          </div>
        </form>

        <router-link to="/" class="col-start-2 justify-self-center font-bold text-2xl text-brand-600 whitespace-nowrap">
          Skincare.co
        </router-link>

        <div class="col-start-3 flex items-center gap-5 text-sm justify-self-end">
          <div ref="accountMenuRef" class="relative">
            <button
              class="flex flex-col items-center gap-0.5 hover:text-brand-600"
              @click="auth.isLoggedIn ? (showAccountMenu = !showAccountMenu) : router.push('/login')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="text-xs hidden sm:block">{{ auth.isLoggedIn ? "Akun" : "Masuk" }}</span>
            </button>

            <div
              v-if="showAccountMenu"
              class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 text-left z-20"
            >
              <p class="px-4 py-1 text-xs text-gray-400">Halo, {{ auth.user?.name }}</p>
              <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-50" @click="showAccountMenu = false">
                Profil
              </router-link>
              <router-link to="/wishlist" class="block px-4 py-2 hover:bg-gray-50" @click="showAccountMenu = false">
                Wishlist
              </router-link>
              <router-link to="/orders" class="block px-4 py-2 hover:bg-gray-50" @click="showAccountMenu = false">
                Pesanan
              </router-link>
              <router-link
                v-if="auth.isAdmin"
                to="/admin/products"
                class="block px-4 py-2 hover:bg-gray-50"
                @click="showAccountMenu = false"
              >
                Admin
              </router-link>
              <button class="block w-full text-left px-4 py-2 text-brand-600 hover:bg-gray-50" @click="logout">
                Keluar
              </button>
            </div>
          </div>

          <router-link to="/cart" class="flex flex-col items-center gap-0.5 hover:text-brand-600 relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
              <path
                d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2m9 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-xs hidden sm:block">Keranjang</span>
            <span
              v-if="cart.itemCount"
              class="absolute -top-1 -right-1 text-[10px] bg-brand-600 text-white rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ cart.itemCount }}
            </span>
          </router-link>
        </div>
      </div>

      <nav class="border-t">
        <div class="max-w-6xl mx-auto px-4 flex items-center justify-center gap-6 text-xs font-semibold tracking-wide py-3 overflow-x-auto">
          <router-link
            v-for="c in productStore.categories"
            :key="c.id"
            :to="{ path: '/products', query: { category: c.slug } }"
            class="whitespace-nowrap hover:text-brand-600"
            :class="route.path === '/products' && route.query.category === c.slug ? 'text-brand-600' : 'text-gray-600'"
          >
            {{ c.name.toUpperCase() }}
          </router-link>
          <router-link
            to="/skin-quiz"
            class="whitespace-nowrap hover:text-brand-600"
            :class="route.path === '/skin-quiz' ? 'text-brand-600' : 'text-gray-600'"
          >
            SKIN QUIZ
          </router-link>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>
