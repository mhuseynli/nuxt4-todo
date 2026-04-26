<template>
  <div class="input-group">
    <label v-if="label" class="input-group__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="input-group__field"
      :class="{ 'input-group__field--error': !!error }"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <span v-if="error" class="input-group__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  label?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  placeholder: '',
  type: 'text',
  disabled: false
});

const model = defineModel<string>({ default: '' });
const id = useId();
</script>

<style lang="scss">
@use '~/assets/scss/variables' as vars;

.input-group {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-xs;
  width: 100%;

  &__label {
    font-family: vars.$font-family-base;
    font-size: vars.$font-size-label-sm;
    font-weight: vars.$font-weight-semibold;
    color: vars.$color-text-muted;
    text-transform: uppercase;
  }

  &__field {
    width: 100%;
    padding: vars.$spacing-sm vars.$spacing-md;
    font-family: vars.$font-family-base;
    font-size: vars.$font-size-body-md;
    color: vars.$color-text;
    background-color: vars.$color-canvas;
    border: 1px solid vars.$color-border;
    border-radius: vars.$border-radius-base;
    transition: all 0.2s ease;
    outline: none;

    &::placeholder {
      color: vars.$color-text-muted;
    }

    &:focus {
      border-color: vars.$color-tertiary;
      box-shadow: inset 0 0 0 1px vars.$color-tertiary;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background-color: vars.$color-border;
    }

    &--error {
      border-color: vars.$color-error;

      &:focus {
        border-color: vars.$color-error;
        box-shadow: inset 0 0 0 1px vars.$color-error;
      }
    }
  }

  &__error {
    font-family: vars.$font-family-base;
    font-size: vars.$font-size-label-sm;
    color: vars.$color-error;
  }
}
</style>
