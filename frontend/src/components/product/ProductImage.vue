<script setup lang="ts">
defineProps<{ src?: string | null; alt: string }>();
</script>

<template>
  <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover" />
  <div v-else class="w-full h-full bg-brand-50 flex items-center justify-center">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="w-1/3 h-1/3 text-brand-200">
      <path
        d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 14 5-6 3 3 4-5 4 5M8.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>
