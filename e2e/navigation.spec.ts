import { test, expect } from "@playwright/test"
import { mockGitHubAPI, clearPersistedState } from "./helpers/api-mock"

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await clearPersistedState(page)
    await mockGitHubAPI(page)
  })

  test("root redirects to /repositories", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/repositories/)
  })

  test("navigate to developers page", async ({ page }) => {
    await page.goto("/repositories")
    await page.getByRole("link", { name: "developers" }).click()
    await expect(page).toHaveURL(/\/developers/)
    await expect(page.locator("main")).toBeVisible()
  })

  test("navigate back to repositories page", async ({ page }) => {
    await page.goto("/developers")
    await page.getByRole("link", { name: "repositories" }).click()
    await expect(page).toHaveURL(/\/repositories/)
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()
  })

  test("active nav link is visually distinct", async ({ page }) => {
    await page.goto("/repositories")
    const repoLink = page.getByRole("link", { name: "repositories" })
    await expect(repoLink).toHaveClass(/text-primary/)

    await page.getByRole("link", { name: "developers" }).click()
    const devLink = page.getByRole("link", { name: "developers" })
    await expect(devLink).toHaveClass(/text-primary/)
  })

  test("timestamp badge is visible", async ({ page }) => {
    await page.goto("/repositories")
    await expect(page.getByText(/updated at:/)).toBeVisible()
    await expect(page.getByText(/\d{2}:\d{2}:\d{2}/)).toBeVisible()
  })
})
