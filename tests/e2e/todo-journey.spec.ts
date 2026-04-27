import { test, expect } from '@playwright/test';

test.describe('Todo Application Features', () => {
  test.beforeEach(async ({ page }) => {
    // Set up a promise to wait for the initial API fetch to complete
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('dummyjson.com/todos') && response.status() === 200
    );

    // Navigate to the app
    await page.goto('/');

    // Wait for the actual network request to finish (avoids false positives on skeleton loaders)
    await responsePromise;

    // Ensure the skeletons are gone and the actual list is visible
    await expect(page.locator('.todo-list__skeletons')).toHaveCount(0);
    await expect(page.locator('.page-index__list-section')).toBeVisible();
  });

  test('Should add a new local task and display it in the "Just Added" section', async ({
    page
  }) => {
    const taskName = 'Isolated Add Task';

    await test.step('When the user adds a new task', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await expect(input).toBeVisible();
      await input.fill(taskName);

      const submitBtn = page.getByRole('button', { name: 'Add Task' });
      await submitBtn.click();
    });

    await test.step('Then it appears in the "Just Added" section', async () => {
      await expect(page.getByRole('heading', { name: 'Just Added' })).toBeVisible();

      const newTask = page.locator('.todo-item--highlighted').filter({ hasText: taskName });
      await expect(newTask).toBeVisible();

      await expect(newTask).toHaveScreenshot('new-task-added.png');
    });
  });

  test('Should optimistically toggle a local task to a completed state', async ({ page }) => {
    const taskName = 'Isolated Toggle Task';

    await test.step('Given a newly added local task', async () => {
      await page.getByPlaceholder('What needs to be done?').fill(taskName);
      await page.getByRole('button', { name: 'Add Task' }).click();
    });

    await test.step('When the user clicks the checkbox', async () => {
      const toggle = page.getByRole('checkbox', { name: `Toggle todo: ${taskName}` });
      await expect(toggle).toBeVisible();
      await toggle.check();
    });

    await test.step('Then the task visually updates to a completed state', async () => {
      const toggledTask = page.locator('.todo-item--highlighted').filter({ hasText: taskName });

      await expect(toggledTask).toHaveClass(/todo-item--completed/);
      await expect(toggledTask.locator('.todo-item__text')).toHaveCSS(
        'text-decoration',
        /line-through/
      );

      await expect(toggledTask).toHaveScreenshot('new-task-completed.png');
    });
  });

  test('Should optimistically delete a local task', async ({ page }) => {
    const taskName = 'Isolated Delete Task';

    await test.step('Given a newly added local task', async () => {
      await page.getByPlaceholder('What needs to be done?').fill(taskName);
      await page.getByRole('button', { name: 'Add Task' }).click();
    });

    await test.step('When the user clicks the delete button', async () => {
      const deleteBtn = page.getByRole('button', { name: `Delete todo: ${taskName}` });
      await expect(deleteBtn).toBeVisible();
      await deleteBtn.click();
    });

    await test.step('Then the task is completely removed from the DOM', async () => {
      const deletedTask = page.locator('.todo-item').filter({ hasText: taskName });
      await expect(deletedTask).toHaveCount(0);
    });
  });

  test('Should interact with server-fetched tasks correctly', async ({ page }) => {
    const serverSection = page.locator('.todo-list__section').filter({ hasText: 'All Tasks' });

    await test.step('Given the initial server tasks load in the "All Tasks" section', async () => {
      await expect(serverSection).toBeVisible();
      await expect(serverSection.locator('.todo-item')).toHaveCount(10);
    });

    await test.step('When the user clicks the checkbox on the FIRST server task', async () => {
      const firstTask = serverSection.locator('.todo-item').first();
      const checkbox = firstTask.getByRole('checkbox');
      await checkbox.check();
    });

    await test.step('Then that specific server task visually updates to a completed state', async () => {
      const firstTask = serverSection.locator('.todo-item').first();
      await expect(firstTask).toHaveClass(/todo-item--completed/);
      await expect(firstTask.locator('.todo-item__text')).toHaveCSS(
        'text-decoration',
        /line-through/
      );
    });

    await test.step('When the user clicks the delete button on the SECOND server task', async () => {
      const secondTask = serverSection.locator('.todo-item').nth(1);
      const deleteBtn = secondTask.getByRole('button', { name: /Delete todo/ });
      await deleteBtn.click();
    });

    await test.step('Then that specific server task is removed from the DOM', async () => {
      await expect(serverSection.locator('.todo-item')).toHaveCount(9);
    });
  });

  test('Should persist local tasks during server pagination', async ({ page }) => {
    const taskName = 'Persistent Local Task';
    const justAddedSection = page.locator('.todo-list__section').filter({ hasText: 'Just Added' });
    const allTasksSection = page.locator('.todo-list__section').filter({ hasText: 'All Tasks' });

    await test.step('Given the user adds a new local task named "Persistent Local Task"', async () => {
      await page.getByPlaceholder('What needs to be done?').fill(taskName);
      await page.getByRole('button', { name: 'Add Task' }).click();
    });

    await test.step('Then it appears in the "Just Added" section', async () => {
      await expect(justAddedSection).toBeVisible();
      await expect(
        justAddedSection.locator('.todo-item').filter({ hasText: taskName })
      ).toBeVisible();
    });

    await test.step('When the user scrolls to the bottom and clicks the "Next Page" pagination button', async () => {
      // Capture the text of the first server task to ensure it changes later
      const firstServerTaskText = await allTasksSection.locator('.todo-item').first().innerText();

      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('dummyjson.com/todos') && response.status() === 200
      );

      const nextBtn = page.getByRole('button', { name: 'Next' });
      await nextBtn.scrollIntoViewIfNeeded();
      await nextBtn.click();

      await responsePromise;

      // Ensure the server tasks have actually changed
      await expect(allTasksSection.locator('.todo-item').first()).not.toHaveText(
        firstServerTaskText
      );
    });

    await test.step('Then the "All Tasks" section updates with new server tasks from DummyJSON', async () => {
      // Pagination info should update
      await expect(page.locator('.page-index__pagination-info')).toHaveText(/Showing 11 - 20/);
    });

    await test.step('AND the "Persistent Local Task" STILL remains visible at the top in the "Just Added" section', async () => {
      await expect(justAddedSection).toBeVisible();
      const localTask = justAddedSection.locator('.todo-item').filter({ hasText: taskName });
      await expect(localTask).toBeVisible();

      // Ensure it is still at the top (it should be the only one or among the only ones in 'Just Added')
      await expect(localTask).toHaveClass(/todo-item--highlighted/);
    });
  });
});
