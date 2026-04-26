<template>
  <form class="todo-form" @submit.prevent="handleSubmit">
    <div class="todo-form__input-wrapper">
      <BaseInput v-model="newTodo" placeholder="What needs to be done?" :disabled="isSubmitting" />
    </div>
    <BaseButton type="submit" variant="primary" :disabled="!isValid || isSubmitting">
      Add Task
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseInput from '~/components/ui/BaseInput.vue';
import BaseButton from '~/components/ui/BaseButton.vue';

const emit = defineEmits<{
  (e: 'add', text: string): void;
}>();

const newTodo = ref('');
const isSubmitting = ref(false);

const isValid = computed(() => {
  return newTodo.value.trim().length > 0;
});

const handleSubmit = () => {
  if (!isValid.value) return;

  const text = newTodo.value.trim();
  emit('add', text);

  // Clear input immediately for Optimistic UI flow
  newTodo.value = '';
};
</script>

<style lang="scss">
@use '~/assets/scss/variables' as vars;

.todo-form {
  display: flex;
  gap: vars.$spacing-md;
  align-items: flex-start;
  width: 100%;

  &__input-wrapper {
    flex: 1;
  }
}
</style>
