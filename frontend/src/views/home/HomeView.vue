<script setup lang="ts">
import { onMounted, ref } from "vue";
import { catalogApi } from "@/api/endpoints/catalog.api";
import { reviewsApi } from "@/api/endpoints/reviews.api";
import type { Product, RecentReview } from "@/types";
import ProductCard from "@/components/product/ProductCard.vue";
import HeroCarousel from "@/components/home/HeroCarousel.vue";
import skinQuizBanner from "@/assets/banners/skin-quiz.jpg";
import trendingBanner from "@/assets/banners/trending.jpg";
import newArrivalBanner from "@/assets/banners/new-arrival.jpg";

const trending = ref<Product[]>([]);
const newArrivals = ref<Product[]>([]);
const testimonials = ref<RecentReview[]>([]);

const slides = [
  {
    title: "Temukan skincare yang cocok untuk kulitmu",
    subtitle: "Isi skin quiz singkat, dapatkan rekomendasi produk sesuai jenis kulitmu.",
    ctaText: "Mulai Skin Quiz",
    ctaTo: "/skin-quiz",
    image: skinQuizBanner,
  },
  {
    title: "Produk Paling Dicari",
    subtitle: "Lihat produk yang paling banyak diulas pelanggan kami.",
    ctaText: "Lihat Trending",
    ctaTo: "/products",
    image: trendingBanner,
  },
  {
    title: "Produk Terbaru",
    subtitle: "Koleksi terbaru baru saja ditambahkan ke katalog.",
    ctaText: "Jelajahi Katalog",
    ctaTo: "/products",
    image: newArrivalBanner,
  },
];

onMounted(async () => {
  const [trendingRes, newRes, reviewsRes] = await Promise.all([
    catalogApi.listTrending(8),
    catalogApi.listProducts({ limit: 8 }),
    reviewsApi.listRecent(6),
  ]);
  if (trendingRes.ok) trending.value = trendingRes.data;
  if (newRes.ok) newArrivals.value = newRes.data.products;
  if (reviewsRes.ok) testimonials.value = reviewsRes.data;
});
</script>

<template>
  <div>
    <HeroCarousel :slides="slides" />

    <section v-if="trending.length" class="max-w-6xl mx-auto px-4 py-12">
      <h2 class="text-center text-sm font-semibold tracking-widest text-gray-700 mb-6">TRENDING NOW</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard v-for="product in trending" :key="product.id" :product="product" />
      </div>
    </section>

    <section v-if="newArrivals.length" class="max-w-6xl mx-auto px-4 py-12">
      <h2 class="text-center text-sm font-semibold tracking-widest text-gray-700 mb-6">NEW ARRIVAL</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard v-for="product in newArrivals" :key="product.id" :product="product" />
      </div>
    </section>

    <section v-if="testimonials.length" class="bg-brand-50 py-12">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-center text-sm font-semibold tracking-widest text-gray-700 mb-6">WHAT THEY SAID</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="review in testimonials" :key="review.id" class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-amber-500 text-sm mb-1">
              <span v-for="n in 5" :key="n">{{ n <= review.rating ? "★" : "☆" }}</span>
            </p>
            <p class="text-sm text-gray-600 mb-3">&ldquo;{{ review.comment }}&rdquo;</p>
            <p class="text-xs font-medium">{{ review.user.name }}</p>
            <p class="text-xs text-gray-400">{{ review.product.name }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
