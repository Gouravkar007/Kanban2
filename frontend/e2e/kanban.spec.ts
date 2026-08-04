import { test, expect } from "@playwright/test";

test.describe("Kanban Board End-to-End Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders 5 fixed columns with initial dummy data", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "FlowKanban" })).toBeVisible();
    await expect(page.getByText("Backlog")).toBeVisible();
    await expect(page.getByText("To Do")).toBeVisible();
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByText("In Review")).toBeVisible();
    await expect(page.getByText("Done")).toBeVisible();
  });

  test("allows renaming a column inline", async ({ page }) => {
    // Click edit button for Backlog column
    const backlogHeader = page.getByRole("heading", { name: "Backlog" });
    await backlogHeader.click();

    // Input field should appear
    const input = page.locator("input[value='Backlog']");
    await expect(input).toBeVisible();
    await input.fill("Prioritized Backlog");
    await input.press("Enter");

    // Title should update
    await expect(page.getByRole("heading", { name: "Prioritized Backlog" })).toBeVisible();
  });

  test("allows adding a new card to a column", async ({ page }) => {
    // Click Add Card on first column
    const addCardBtns = page.getByRole("button", { name: "Add Card" });
    await addCardBtns.first().click();

    // Modal should open
    await expect(page.getByRole("heading", { name: "Create New Card" })).toBeVisible();

    // Fill title and details
    await page.fill("input[placeholder*='Implement user']", "Write Automated Playwright Suite");
    await page.fill("textarea", "Ensure all user workflows are verified thoroughly.");

    // Submit form
    await page.click("button[type='submit']");

    // Verify card is visible on board
    await expect(page.getByText("Write Automated Playwright Suite")).toBeVisible();
    await expect(page.getByText("Ensure all user workflows are verified thoroughly.")).toBeVisible();
  });

  test("allows deleting an existing card", async ({ page }) => {
    const cardTitle = "Design System Tokens";
    await expect(page.getByText(cardTitle)).toBeVisible();

    // Hover card to expose delete button
    const card = page.locator("div").filter({ hasText: cardTitle }).last();
    await card.hover();

    const deleteBtn = page.getByRole("button", { name: `Delete card ${cardTitle}` });
    await deleteBtn.click();

    // Card should no longer be visible
    await expect(page.getByText(cardTitle)).toBeHidden();
  });

  test("contains no emojis anywhere in page content", async ({ page }) => {
    const content = await page.content();
    // Regex matching emoji characters
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(content)).toBe(false);
  });
});
