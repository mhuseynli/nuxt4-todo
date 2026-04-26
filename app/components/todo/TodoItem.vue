<template>
  <div
    :class="[
      'todo-item',
      { 'todo-item--completed': todo.completed, 'todo-item--highlighted': isHighlighted }
    ]"
  >
    <label class="todo-item__label">
      <input
        type="checkbox"
        class="todo-item__checkbox"
        :checked="todo.completed"
        :aria-label="`Toggle todo: ${todo.todo}`"
        @change="$emit('toggle', todo.id)"
      />
      <span class="todo-item__text">{{ todo.todo }}</span>
    </label>

    <div class="todo-item__actions">
      <BaseButton
        variant="ghost"
        :aria-label="`Delete todo: ${todo.todo}`"
        @click="$emit('delete', todo.id)"
      >
        Delete
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/types/todo';
import BaseButton from '~/components/ui/BaseButton.vue';

interface Props {
  todo: Todo;
  isHighlighted?: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: 'toggle' | 'delete', id: number): void;
}>();
</script>

<style lang="scss">
@use '~/assets/scss/variables' as vars;

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: vars.$spacing-md;
  background-color: vars.$color-surface;
  border: 1px solid vars.$color-border;
  border-radius: vars.$border-radius-base;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: vars.$shadow-level-1;
    border-color: vars.$color-tertiary;
  }

  &--highlighted {
    border-left: 4px solid vars.$color-primary;
    background-color: rgba(vars.$color-primary, 0.02);
  }

  &__label {
    display: flex;
    align-items: center;
    gap: vars.$spacing-md;
    flex: 1;
    cursor: pointer;
  }

  &__checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: vars.$color-primary;
  }

  &__text {
    font-family: vars.$font-family-base;
    font-size: vars.$font-size-body-md;
    color: vars.$color-text;
    transition:
      color 0.2s ease,
      text-decoration 0.2s ease;
  }

  &--completed {
    background-color: vars.$color-canvas;
    border-style: dashed;
    border-left-width: 1px;
    border-left-color: vars.$color-border;

    .todo-item__text {
      color: vars.$color-text-muted;
      text-decoration: line-through;
    }
  }

  &--completed.todo-item--highlighted {
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: rgba(vars.$color-primary, 0.5);
  }

  &__actions {
    margin-left: vars.$spacing-md;
  }
}
</style>
