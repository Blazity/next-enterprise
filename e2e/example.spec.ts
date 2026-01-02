import { expect, test } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("./")

  await expect(page).toHaveTitle(/1Commerce.*Enterprise Infrastructure Terminal/)
})
