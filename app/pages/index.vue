<template>
  <div class="page-index">
    <header class="page-index__header">
      <h1 class="page-index__title">Tasks</h1>
      <p class="page-index__subtitle">Way to do :)</p>
    </header>

    <div v-if="error" class="page-index__error">
      {{ error.message }}
    </div>

    <section class="page-index__form-section">
      <TodoForm @add="handleAddTodo" />
    </section>

    <section class="page-index__list-section">
      <TodoList
        :local-todos="localAddedTodos"
        :server-todos="activeServerTodos"
        :pending="pending"
        @toggle="handleToggleTodo"
        @delete="handleDeleteTodo"
      />
    </section>

    <footer class="page-index__pagination">
      <BaseButton variant="ghost" :disabled="skip === 0 || pending" @click="prevPage">
        Previous
      </BaseButton>

      <span class="page-index__pagination-info">
        Showing {{ currentRangeStart }} - {{ currentRangeEnd }} of {{ total }}
      </span>

      <BaseButton variant="ghost" :disabled="currentRangeEnd >= total || pending" @click="nextPage">
        Next
      </BaseButton>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTodos } from '~/composables/useTodos';
import TodoForm from '~/components/todo/TodoForm.vue';
import TodoList from '~/components/todo/TodoList.vue';
import BaseButton from '~/components/ui/BaseButton.vue';

const {
  localAddedTodos,
  activeServerTodos,
  total,
  pending,
  error,
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo
} = useTodos();

const skip = ref(0);
const limit = ref(10);

const currentRangeStart = computed(() => (total.value === 0 ? 0 : skip.value + 1));
const currentRangeEnd = computed(() => Math.min(skip.value + limit.value, total.value));

onMounted(() => {
  fetchTodos(skip.value, limit.value);
});

const handleAddTodo = async (text: string) => {
  await addTodo(text);
  // Increment local total to reflect optimistic addition
  total.value += 1;
};

const handleToggleTodo = async (id: number) => {
  await toggleTodo(id);
};

const handleDeleteTodo = async (id: number) => {
  await deleteTodo(id);
  total.value = Math.max(0, total.value - 1);
};

const prevPage = async () => {
  if (skip.value > 0) {
    skip.value = Math.max(0, skip.value - limit.value);
    await fetchTodos(skip.value, limit.value);
  }
};

const nextPage = async () => {
  if (currentRangeEnd.value < total.value) {
    skip.value += limit.value;
    await fetchTodos(skip.value, limit.value);
  }
};
</script>

<style lang="scss">
@use '~/assets/scss/variables' as vars;

.page-index {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-xl;

  &__header {
    text-align: center;
    border-bottom: 1px solid vars.$color-border;
    padding-bottom: vars.$spacing-lg;
  }

  &__title {
    font-family: vars.$font-family-base;
    font-size: vars.$font-size-display-lg;
    font-weight: vars.$font-weight-bold;
    color: vars.$color-text;
    margin: 0 0 vars.$spacing-xs 0;
    letter-spacing: -0.02em;
  }

  &__subtitle {
    font-family: vars.$font-family-base;
    font-size: vars.$font-size-body-lg;
    color: vars.$color-text-muted;
    margin: 0;
  }

  &__error {
    padding: vars.$spacing-md;
    background-color: rgba(vars.$color-error, 0.1);
    color: vars.$color-error;
    border-radius: vars.$border-radius-base;
    text-align: center;
    font-family: vars.$font-family-base;
    font-weight: vars.$font-weight-medium;
  }

  &__form-section {
    width: 100%;
  }

  &__list-section {
    width: 100%;
    min-height: 300px;
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: vars.$spacing-lg;
    border-top: 1px solid vars.$color-border;

    &-info {
      font-family: vars.$font-family-base;
      font-size: vars.$font-size-label-md;
      color: vars.$color-text-muted;
      font-weight: vars.$font-weight-medium;
    }
  }
}
</style>
