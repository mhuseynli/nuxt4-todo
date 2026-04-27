# Architecture: The Hybrid Store Pattern

## Overview
The Todo application integrates with the public DummyJSON API (`https://dummyjson.com/todos`). However, this API presents a unique challenge: it is a read-only mock server. While it returns success codes (e.g., `201 Created` or `200 OK`) for mutation requests (POST, PUT, DELETE), it **does not actually persist** those changes on the server.

If a user were to add a task and then immediately fetch the next page of tasks from the server, their newly added task would disappear. To solve this without building a custom backend, we implemented a **Hybrid Store Architecture** leveraging an advanced Optimistic UI strategy.

## The "Inbox vs Backlog" UX Pattern
If we simply merged local tasks with server tasks, changing the page would result in a jarring UX bug where a newly added task floats at the top of Page 3. 

Instead of fighting the mock API, **I turned this technical limitation into a UX advantage.** I logically separated the application's state into two distinct domains, mimicking a "Submit Later" or "Inbox" workflow found in modern productivity apps:

### 1. The Local "Inbox" (`localAddedTodos`)
Whenever a user creates a new task, we instantly generate a temporary ID and unshift the object into a dedicated `localAddedTodos` array. This array is rendered at the top of the UI under a "Just Added" header. It proves the POST API call was made, but keeps the local data safely pinned to the top of the screen regardless of server pagination.

### 2. The Server "Backlog" (`serverTodos`)
The `serverTodos` array acts as the source of truth for items fetched from the backend. This array powers the "All Tasks" section of the UI.

### 3. The Diff State (`localDeletedIds` & `localToggledIds`)
Because the server won't remember if a user deleted or completed a pre-existing task, we must maintain a local "diff" state that sits on top of the server data:
- `localDeletedIds`: An array of numbers. When a user deletes a server task, its ID is pushed here.
- `localToggledIds`: A record/dictionary mapping IDs to boolean states. When a user completes a server task, its new state is recorded here.

We combine these using a Vue `computed` property (`activeServerTodos`). This property maps over the raw `serverTodos`, filters out anything present in `localDeletedIds`, and overrides the `completed` status with any values found in `localToggledIds`. 

## The `isLocal` Bypass
To prevent our Optimistic UI from fighting the server, every item added to the local inbox is tagged with a hidden `isLocal: true` flag. 

If a user attempts to edit or delete one of their newly added local tasks, the composable detects the `isLocal` flag and **intentionally skips** the `$fetch` request to the backend. This prevents the mock server from throwing a guaranteed `404 Not Found` error and causing our optimistic error-handling to rollback the user's action.
