<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

interface Slide {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaTo: string;
  image: string;
}

const props = defineProps<{ slides: Slide[] }>();

const active = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

function next() {
  active.value = (active.value + 1) % props.slides.length;
}
function prev() {
  active.value = (active.value - 1 + props.slides.length) % props.slides.length;
}
function goTo(i: number) {
  active.value = i;
}

onMounted(() => {
  timer = setInterval(next, 4500);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="relative overflow-hidden bg-brand-100">
    <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${active * 100}%)` }">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="relative w-full shrink-0 text-center py-20 px-4 bg-cover bg-center"
        :style="{ backgroundImage: `url(${slide.image})` }"
      >
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative">
          <h1 class="text-3xl sm:text-4xl font-bold text-white">{{ slide.title }}</h1>
          <p class="text-white/90 mt-3">{{ slide.subtitle }}</p>
          <router-link
            :to="slide.ctaTo"
            class="inline-block mt-6 bg-brand-600 text-white px-6 py-3 rounded font-semibold hover:bg-brand-700"
          >
            {{ slide.ctaText }}
          </router-link>
        </div>
      </div>
    </div>

    <button
      v-if="slides.length > 1"
      class="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 items-center justify-center text-gray-600 hover:bg-white"
      @click="prev"
    >
      ‹
    </button>
    <button
      v-if="slides.length > 1"
      class="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 items-center justify-center text-gray-600 hover:bg-white"
      @click="next"
    >
      ›
    </button>

    <div v-if="slides.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="w-2 h-2 rounded-full transition-colors"
        :class="i === active ? 'bg-brand-600' : 'bg-brand-300'"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>
