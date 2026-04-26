# DummyJSON Optimistic UI Strategy

## Context
DummyJSON (`https://dummyjson.com/todos`) is a read-only mock API. While it responds with success status codes (e.g., 200 OK or 201 Created) to mutation requests (POST, PUT, DELETE), it **does not persist** these changes on the server. If you fetch the list of todos again after a mutation, the newly added/updated/deleted item will not reflect the change.

## Iron-Clad Rule
**Optimistic UI is Mandatory.** All state mutations must be handled optimistically in the local state.

## Implementation Guidelines
1. **Local State as Source of Truth:**
   Use a reactive state (e.g., a composable using `useState` or `ref`) to hold the list of todos fetched initially from the API.

2. **Instant UI Updates:**
   When a user performs an action (Add, Toggle, Delete):
   - Immediately update the local state to reflect the expected outcome.
   - For 'Add', generate a temporary unique ID (e.g., `Date.now()`).
   - Tag newly added optimistic items with `isLocal: true`.
   - Ensure the UI updates instantly without waiting for the API response.

3. **Background API Call:**
   - Fire the corresponding API call (POST, PUT, DELETE) in the background.
   - If the API call returns a successful response (even if it's a mock response), do nothing; the local state is already correct.

4. **Error Handling & Reversion:**
   - If the API call fails (network error, 500, etc.), catch the error.
   - Revert the local state back to its previous condition before the optimistic update.
   - Show a user-friendly error notification explaining that the action failed (e.g., setting `error.value = new Error(...)`).

5. **No Re-fetching on Mutation:**
   - **DO NOT** re-fetch the list of todos from the API after a mutation. Because DummyJSON doesn't persist changes, a re-fetch will erase the optimistic updates made locally.

6. **The `isLocal` Bypass:**
   - For `PUT` (toggle) and `DELETE` actions, check if the target item has `isLocal: true`.
   - If it is a local item, update the UI state but **intentionally skip** the `$fetch` call to prevent a guaranteed 404 error from the mock server.
