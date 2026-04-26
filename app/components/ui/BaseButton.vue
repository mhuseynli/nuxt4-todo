<template>
  <button
    :class="['button', `button--${variant}`, { 'button--loading': loading }]"
    :disabled="loading || disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="button__spinner"></span>
    <span class="button__content" :class="{ 'button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false
});

defineEmits(['click']);
</script>

<style lang="scss">
@use 'sass:color';
@use '~/assets/scss/variables' as vars;

.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: vars.$spacing-sm vars.$spacing-lg;
  border: none;
  border-radius: vars.$border-radius-pill;
  font-family: vars.$font-family-base;
  font-size: vars.$font-size-body-md;
  font-weight: vars.$font-weight-semibold;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--primary {
    background-color: vars.$color-primary;
    color: vars.$color-surface;

    &:hover:not(:disabled) {
      background-color: color.adjust(#3b82f6, $lightness: -10%);
    }
  }

  &--danger {
    background-color: vars.$color-error;
    color: vars.$color-surface;

    &:hover:not(:disabled) {
      background-color: color.adjust(#ba1a1a, $lightness: -10%);
    }
  }

  &--ghost {
    background-color: transparent;
    color: vars.$color-text;
    border: 1px solid vars.$color-border;

    &:hover:not(:disabled) {
      background-color: vars.$color-canvas;
    }
  }

  &--loading {
    cursor: wait;
  }

  &__content {
    display: inline-flex;
    align-items: center;
    transition: opacity 0.2s ease;

    &--hidden {
      opacity: 0;
    }
  }

  &__spinner {
    position: absolute;
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: button-spin 0.8s linear infinite;
  }
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
