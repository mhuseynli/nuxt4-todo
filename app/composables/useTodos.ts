import type { Todo, TodosResponse } from '~/types/todo';

export const useTodos = () => {
  const serverTodos = useState<Todo[]>('server-todos', () => []);
  const localAddedTodos = useState<Todo[]>('local-added-todos', () => []);
  const localDeletedIds = useState<number[]>('local-deleted-ids', () => []);
  const localToggledIds = useState<Record<number, boolean>>('local-toggled-ids', () => ({}));

  const total = useState<number>('todos-total', () => 0);
  const pending = useState<boolean>('todos-pending', () => false);
  const error = useState<Error | null>('todos-error', () => null);

  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const activeServerTodos = computed(() => {
    return serverTodos.value
      .filter((todo) => !localDeletedIds.value.includes(todo.id))
      .map((todo) => {
        if (todo.id in localToggledIds.value) {
          return { ...todo, completed: localToggledIds.value[todo.id]! };
        }
        return todo;
      });
  });

  const todos = computed(() => {
    return [...localAddedTodos.value, ...activeServerTodos.value];
  });

  const fetchTodos = async (skip = 0, limit = 30) => {
    pending.value = true;
    error.value = null;
    try {
      const response = await $fetch<TodosResponse>(`${apiBase}/todos`, {
        query: { skip, limit }
      });
      serverTodos.value = response.todos;
      total.value = response.total;
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to fetch todos');
      console.error('Failed to fetch todos:', e);
    } finally {
      pending.value = false;
    }
  };

  const addTodo = async (text: string) => {
    const tempId = Date.now();
    const newTodo: Todo = {
      id: tempId,
      todo: text,
      completed: false,
      userId: 1,
      isLocal: true
    };

    const previousLocalAdded = [...localAddedTodos.value];
    localAddedTodos.value = [newTodo, ...localAddedTodos.value];

    try {
      await $fetch(`${apiBase}/todos/add`, {
        method: 'POST',
        body: {
          todo: text,
          completed: false,
          userId: 1
        }
      });
    } catch (e) {
      localAddedTodos.value = previousLocalAdded;
      error.value = e instanceof Error ? e : new Error('Failed to add todo');
      console.error('Failed to add todo:', e);
      setTimeout(() => {
        error.value = null;
      }, 3000);
    }
  };

  const toggleTodo = async (id: number) => {
    const localTodoIndex = localAddedTodos.value.findIndex((t) => t.id === id);
    const isLocal = localTodoIndex !== -1;

    if (isLocal) {
      const targetTodo = localAddedTodos.value[localTodoIndex];
      if (!targetTodo) return;

      const updatedTodo: Todo = {
        ...targetTodo,
        completed: !targetTodo.completed
      };

      localAddedTodos.value = [
        ...localAddedTodos.value.slice(0, localTodoIndex),
        updatedTodo,
        ...localAddedTodos.value.slice(localTodoIndex + 1)
      ];
      return;
    }

    const targetTodo = serverTodos.value.find((t) => t.id === id);
    if (!targetTodo) return;

    const currentStatus =
      id in localToggledIds.value ? localToggledIds.value[id] : targetTodo.completed;
    const newCompletedStatus = !currentStatus;

    const previousToggled = { ...localToggledIds.value };
    localToggledIds.value = {
      ...localToggledIds.value,
      [id]: newCompletedStatus
    };

    try {
      await $fetch(`${apiBase}/todos/${id}`, {
        method: 'PUT',
        body: {
          completed: newCompletedStatus
        }
      });
    } catch (e) {
      localToggledIds.value = previousToggled;
      error.value = e instanceof Error ? e : new Error('Failed to toggle todo');
      console.error('Failed to toggle todo:', e);
      setTimeout(() => {
        error.value = null;
      }, 3000);
    }
  };

  const deleteTodo = async (id: number) => {
    const localTodoIndex = localAddedTodos.value.findIndex((t) => t.id === id);
    const isLocal = localTodoIndex !== -1;

    if (isLocal) {
      localAddedTodos.value = localAddedTodos.value.filter((t) => t.id !== id);
      return;
    }

    const previousDeleted = [...localDeletedIds.value];
    localDeletedIds.value = [...localDeletedIds.value, id];

    try {
      await $fetch(`${apiBase}/todos/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      localDeletedIds.value = previousDeleted;
      error.value = e instanceof Error ? e : new Error('Failed to delete todo');
      console.error('Failed to delete todo:', e);
      setTimeout(() => {
        error.value = null;
      }, 3000);
    }
  };

  return {
    serverTodos,
    localAddedTodos,
    activeServerTodos,
    todos,
    localDeletedIds,
    localToggledIds,
    total,
    pending,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo
  };
};
