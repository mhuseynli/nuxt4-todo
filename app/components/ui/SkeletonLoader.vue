<template>
  <div class="skeleton" :style="{ width, height, borderRadius }"></div>
</template>

<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  borderRadius?: string;
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '24px',
  borderRadius: '0.5rem' // Corresponds to border-radius-sm
});
</script>

<style lang="scss">
@use '~/assets/scss/variables' as vars;

.skeleton {
  background: linear-gradient(
    90deg,
    vars.$color-border 25%,
    vars.$color-canvas 50%,
    vars.$color-border 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite linear;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
