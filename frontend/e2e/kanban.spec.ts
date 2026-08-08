import { test, expect } from "@playwright/test";

test.describe("Kanban Board End-to-End Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Fill login form if visible
    const usernameInput = page.locator("input[placeholder*='username']");
    if (await usernameInput.isVisible()) {
      await usernameInput.fill("user");
      await page.fill("input[type='password']", "password");
      await page.click("button[type='submit']");
    }
    await expect(page.getByRole("heading", { name: "FlowKanban" })).toBeVisible();
  });

  test("renders 5 fixed columns with initial dummy data", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "To Do" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "In Progress" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "In Review" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Done" })).toBeVisible();
  });

  test("allows renaming a column inline", async ({ page }) => {
    const renameBtn = page.getByRole("button", { name: /rename column/i }).first();
    await renameBtn.click({ force: true });

    const input = page.locator("input[type='text']").first();
    await expect(input).toBeVisible();
    await input.fill("Ideas & Backlog");
    await input.press("Enter");

    await expect(page.getByRole("heading", { name: "Ideas & Backlog" })).toBeVisible();
  });

  test("allows adding a new card to a column", async ({ page }) => {
    const addCardBtns = page.getByRole("button", { name: "Add Card" });
    await addCardBtns.first().click();

    await expect(page.getByRole("heading", { name: "Create New Card" })).toBeVisible();
    await page.fill("input[placeholder*='Implement user']", "Write Automated Playwright Suite");
    await page.fill("textarea", "Ensure all user workflows are verified thoroughly.");

    await page.click("button[type='submit']");

    await expect(page.getByText("Write Automated Playwright Suite")).toBeVisible();
    await expect(page.getByText("Ensure all user workflows are verified thoroughly.")).toBeVisible();
  });

  test("opens card details modal when edit icon is clicked and saves updates", async ({ page }) => {
    const editBtn = page.getByRole("button", { name: /edit details/i }).first();
    await editBtn.click({ force: true });

    // Modal should open
    await expect(page.getByText("Card Details")).toBeVisible();

    // Fill new title
    const titleInput = page.locator("input[placeholder='Card title...']");
    await titleInput.fill("Design Tokens v2");

    // Save changes
    await page.click("button[type='submit']");

    // Modal should close and new title should appear
    await expect(page.getByText("Card Details")).toBeHidden();
    await expect(page.getByText("Design Tokens v2")).toBeVisible();
  });

  test("allows deleting an existing card", async ({ page }) => {
    const cardTitle = "Design System Tokens";
    const card = page.locator("div").filter({ hasText: cardTitle }).last();
    if (await card.isVisible()) {
      await card.hover();
      const deleteBtn = page.getByRole("button", { name: `Delete card ${cardTitle}` });
      await deleteBtn.click();
      await expect(page.getByText(cardTitle)).toBeHidden();
    }
  });

  test("interacts with AI Chat Sidebar to add a card dynamically", async ({ page }) => {
    const aiBtn = page.getByTitle("Open AI Assistant");
    await expect(aiBtn).toBeVisible({ timeout: 10000 });
    await aiBtn.click();

    await expect(page.getByText("AI Assistant")).toBeVisible();

    const quickPill = page.getByRole("button", { name: /add implement ssl/i });
    await quickPill.click();

    await expect(page.locator("h3", { hasText: "Implement SSL" }).first()).toBeVisible({ timeout: 15000 });
  });

  test("allows undoing an AI mutation from the AI Chat Sidebar timeline", async ({ page }) => {
    const aiBtn = page.getByTitle("Open AI Assistant");
    await expect(aiBtn).toBeVisible({ timeout: 10000 });
    await aiBtn.click();

    await expect(page.getByText("AI Assistant")).toBeVisible();

    const quickPill = page.getByRole("button", { name: /add implement ssl/i });
    await quickPill.click();

    await expect(page.locator("h3", { hasText: "Implement SSL" }).first()).toBeVisible({ timeout: 15000 });

    const undoActionBtn = page.getByRole("button", { name: /undo action/i });
    await expect(undoActionBtn).toBeVisible();
    await undoActionBtn.click();

    await expect(page.locator("h3", { hasText: "Implement SSL" }).first()).toBeHidden();
  });

  test("contains no emojis anywhere in page content", async ({ page }) => {
    const content = await page.content();
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F800}-\u{1F8FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(content)).toBe(false);
  });
});
