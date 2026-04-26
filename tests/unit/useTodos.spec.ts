import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTodos } from '~/composables/useTodos';

// 1. Import mockNuxtImport or standard vi.mock to mock the global $fetch function
const mockFetch = vi.fn();
vi.stubGlobal('$fetch', mockFetch);

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Clear Nuxt useState to prevent state leaking between tests
    const {
      serverTodos,
      localAddedTodos,
      localDeletedIds,
      localToggledIds,
      total,
      pending,
      error
    } = useTodos();

    serverTodos.value = [];
    localAddedTodos.value = [];
    localDeletedIds.value = [];
    localToggledIds.value = {};
    total.value = 0;
    pending.value = false;
    error.value = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- INITIAL STATE ---
  it('verifies the initial state (all arrays empty)', () => {
    const { todos, serverTodos, localAddedTodos, localDeletedIds, localToggledIds } = useTodos();

    expect(serverTodos.value).toEqual([]);
    expect(localAddedTodos.value).toEqual([]);
    expect(localDeletedIds.value).toEqual([]);
    expect(localToggledIds.value).toEqual({});
    expect(todos.value).toEqual([]);
  });

  // --- FETCH TODOS ---
  describe('fetchTodos', () => {
    it('fetches server todos successfully and updates total', async () => {
      const { fetchTodos, serverTodos, total, pending } = useTodos();

      mockFetch.mockResolvedValueOnce({
        todos: [{ id: 1, todo: 'Server Task', completed: false, userId: 1 }],
        total: 100,
        skip: 0,
        limit: 30
      });

      // Pending should be true synchronously immediately after calling (though we await it)
      const promise = fetchTodos(0, 30);
      expect(pending.value).toBe(true);

      await promise;

      expect(serverTodos.value).toHaveLength(1);
      expect(total.value).toBe(100);
      expect(pending.value).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/todos'), {
        query: { skip: 0, limit: 30 }
      });
    });

    it('sets error state if fetchTodos rejects', async () => {
      const { fetchTodos, error, pending } = useTodos();

      mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

      await fetchTodos();

      expect(error.value).toBeInstanceOf(Error);
      expect(error.value?.message).toBe('Fetch failed');
      expect(pending.value).toBe(false);
    });
  });

  // --- COMPUTED: activeServerTodos ---
  describe('activeServerTodos', () => {
    it('filters out deleted items and overrides toggled items', () => {
      const { serverTodos, localDeletedIds, localToggledIds, activeServerTodos } = useTodos();

      serverTodos.value = [
        { id: 1, todo: 'Task 1', completed: false, userId: 1 },
        { id: 2, todo: 'Task 2', completed: true, userId: 1 },
        { id: 3, todo: 'Task 3', completed: false, userId: 1 }
      ];

      // Delete Task 2
      localDeletedIds.value = [2];

      // Toggle Task 3 to true
      localToggledIds.value = { 3: true };

      expect(activeServerTodos.value).toHaveLength(2);

      const task1 = activeServerTodos.value.find((t) => t.id === 1);
      expect(task1?.completed).toBe(false);

      const task3 = activeServerTodos.value.find((t) => t.id === 3);
      expect(task3?.completed).toBe(true);
    });
  });

  // --- ADD TODO ---
  describe('addTodo', () => {
    it('addTodo: pushes the new item into localAddedTodos', async () => {
      const { addTodo, localAddedTodos } = useTodos();
      mockFetch.mockResolvedValueOnce({});

      await addTodo('New Todo Task');

      expect(localAddedTodos.value).toHaveLength(1);
      expect(localAddedTodos.value[0]!.todo).toBe('New Todo Task');
      expect(localAddedTodos.value[0]!.isLocal).toBe(true);
      expect(localAddedTodos.value[0]!.completed).toBe(false);
    });

    it('Optimistic Rollback: reverts to its previous state when $fetch rejects on addTodo', async () => {
      const { addTodo, localAddedTodos, error } = useTodos();

      localAddedTodos.value = [
        { id: 1, todo: 'Existing Todo', completed: false, userId: 1, isLocal: true }
      ];
      const previousLength = localAddedTodos.value.length;

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await addTodo('Failing Todo');

      expect(localAddedTodos.value).toHaveLength(previousLength);
      expect(localAddedTodos.value[0]!.todo).toBe('Existing Todo');
      expect(error.value).toBeInstanceOf(Error);
      expect(error.value?.message).toBe('Network error');
    });
  });

  // --- TOGGLE TODO ---
  describe('toggleTodo', () => {
    it('toggles a local item directly without calling API', async () => {
      const { toggleTodo, localAddedTodos } = useTodos();
      localAddedTodos.value = [
        { id: 999, todo: 'Local Task', completed: false, userId: 1, isLocal: true }
      ];

      await toggleTodo(999);

      expect(localAddedTodos.value[0]!.completed).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('toggles a server item and calls API', async () => {
      const { toggleTodo, serverTodos, localToggledIds } = useTodos();
      serverTodos.value = [{ id: 42, todo: 'Server Task', completed: false, userId: 1 }];
      mockFetch.mockResolvedValueOnce({});

      await toggleTodo(42);

      expect(localToggledIds.value[42]).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/42'),
        expect.objectContaining({
          method: 'PUT',
          body: { completed: true }
        })
      );
    });

    it('Optimistic Rollback: reverts toggled server item on API failure', async () => {
      const { toggleTodo, serverTodos, localToggledIds, error } = useTodos();
      serverTodos.value = [{ id: 42, todo: 'Server Task', completed: false, userId: 1 }];
      mockFetch.mockRejectedValueOnce(new Error('API Down'));

      await toggleTodo(42);

      // It should revert back to not being tracked in localToggledIds (or reverting to its previous state)
      expect(localToggledIds.value[42]).toBeUndefined();
      expect(error.value).toBeInstanceOf(Error);
      expect(error.value?.message).toBe('API Down');
    });
  });

  // --- DELETE TODO ---
  describe('deleteTodo', () => {
    it('deletes a local item directly without calling API', async () => {
      const { deleteTodo, localAddedTodos } = useTodos();
      localAddedTodos.value = [
        { id: 999, todo: 'Local Task', completed: false, userId: 1, isLocal: true }
      ];

      await deleteTodo(999);

      expect(localAddedTodos.value).toHaveLength(0);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('deletes a server item by adding ID to localDeletedIds', async () => {
      const { deleteTodo, localDeletedIds, serverTodos } = useTodos();
      serverTodos.value = [{ id: 42, todo: 'Server Task', completed: false, userId: 1 }];
      mockFetch.mockResolvedValueOnce({});

      await deleteTodo(42);

      expect(localDeletedIds.value).toContain(42);
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/todos/42'), {
        method: 'DELETE'
      });
    });

    it('Optimistic Rollback: reverts deleted server item on API failure', async () => {
      const { deleteTodo, serverTodos, localDeletedIds, error } = useTodos();
      serverTodos.value = [{ id: 42, todo: 'Server Task', completed: false, userId: 1 }];
      mockFetch.mockRejectedValueOnce(new Error('API Down'));

      await deleteTodo(42);

      // Should be removed from localDeletedIds array
      expect(localDeletedIds.value).not.toContain(42);
      expect(error.value).toBeInstanceOf(Error);
      expect(error.value?.message).toBe('API Down');
    });
  });
});
