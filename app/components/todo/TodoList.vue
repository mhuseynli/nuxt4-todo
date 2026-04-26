<template>
  <div class="todo-list">
    <template v-if="pending">
      <div class="todo-list__skeletons">
        <SkeletonLoader v-for="i in 5" :key="i" height="64px" border-radius="1rem" />
      </div>
    </template>

    <template v-else-if="localTodos.length === 0 && serverTodos.length === 0">
      <div class="todo-list__empty">
        <h3 class="todo-list__empty-title">All caught up!</h3>
        <p class="todo-list__empty-text">
          You have no pending tasks. Add one above to get started.
        </p>
      </div>
    </template>

    <template v-else>
      <div v-if="localTodos.length > 0" class="todo-list__section">
        <h4 class="todo-list__section-title">Just Added</h4>
        <div class="todo-list__items">
          <TodoItem
            v-for="todo in localTodos"
            :key="todo.id"
            :todo="todo"
            is-highlighted
            @toggle="$emit('toggle', $event)"
            @delete="$emit('delete', $event)"
          />
        </div>
        <hr class="todo-list__divider" />
      </div>

      <div v-if="serverTodos.length > 0" class="todo-list__section">
        <h4 v-if="localTodos.length > 0" class="todo-list__section-title">All Tasks</h4>
        <div class="todo-list__items">
          <TodoItem
            v-for="todo in serverTodos"
            :key="todo.id"
            :todo="todo"
            @toggle="$emit('toggle', $event)"
            @delete="$emit('delete', $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/types/todo';
import TodoItem from './TodoItem.vue';
import SkeletonLoader from '~/components/ui/SkeletonLoader.vue';

interface Props {
  localTodos: Todo[];
  serverTodos: Todo[];
  pending: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: 'toggle' | 'delete', id: number): void;
}>();
</script>

<style lang="scss">
@use '~/assets/scss/variables' as vars;

.todo-list {
  width: 100%;

  &__skeletons,
  &__items {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-sm;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-md;
  }

  &__section-title {
    font-family: vars.$font-family-base;
    font-size: vars.$font-size-label-md;
    font-weight: vars.$font-weight-semibold;
    color: vars.$color-text-muted;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__divider {
    border: none;
    border-top: 1px solid vars.$color-border;
    margin: vars.$spacing-sm 0;
    width: 100%;
  }

  &__empty {
    text-align: center;
    padding: vars.$spacing-xxl vars.$spacing-md;
    background-color: vars.$color-canvas;
    border-radius: vars.$border-radius-base;
    border: 1px dashed vars.$color-border;

    &-title {
      font-family: vars.$font-family-base;
      font-size: vars.$font-size-headline-sm;
      font-weight: vars.$font-weight-semibold;
      color: vars.$color-text;
      margin: 0 0 vars.$spacing-xs 0;
    }

    &-text {
      font-family: vars.$font-family-base;
      font-size: vars.$font-size-body-md;
      color: vars.$color-text-muted;
      margin: 0;
    }
  }
}
</style>
