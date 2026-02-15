import { test, expect } from "@playwright/test"
import { mockGitHubAPI, clearPersistedState } from "./helpers/api-mock"

test.describe("Responsive Layout", () => {
  test.beforeEach(async ({ page }) => {
    await clearPersistedState(page)
    await mockGitHubAPI(page)
  })

  test("desktop 1440px — cards render, no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/repositories")

    await expect(page.getByText("Github Explorer")).toBeVisible()
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()
    const body = page.locator("body")
    const scrollWidth = await body.evaluate((el) => el.scrollWidth)
    const clientWidth = await body.evaluate((el) => el.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test("tablet 768px — layout intact", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/repositories")

    await expect(page.getByText("Github Explorer")).toBeVisible()
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "developers" })).toBeVisible()
  })

  test("mobile 375px — navbar stacks, cards visible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/repositories")

    await expect(page.getByText("Github Explorer")).toBeVisible()
    await expect(page.getByRole("link", { name: "repositories" })).toBeVisible()
    await expect(page.getByRole("link", { name: "developers" })).toBeVisible()
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()
  })

  test("mobile 375px — contributors modal is usable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/repositories")

    await page.getByRole("button", { name: "View Contributors" }).first().click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole("heading", { name: "Contributors" })).toBeVisible()

    const dialogBox = await dialog.boundingBox()
    expect(dialogBox).toBeTruthy()
    expect(dialogBox!.width).toBeLessThanOrEqual(375)
  })
})
