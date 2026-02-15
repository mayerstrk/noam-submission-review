import { test, expect } from "@playwright/test"
import {
  mockGitHubAPI,
  mockGitHubAPIRateLimit,
  mockGitHubAPIError,
  clearPersistedState,
} from "./helpers/api-mock"

test.describe("Error States", () => {
  test.beforeEach(async ({ page }) => {
    await clearPersistedState(page)
  })

  test("shows rate-limit banner on 403", async ({ page }) => {
    await mockGitHubAPIRateLimit(page)
    await page.goto("/repositories")
    await expect(page.getByText(/rate limit/i)).toBeVisible()
  })

  test("shows error state with retry button on 500", async ({ page }) => {
    await mockGitHubAPIError(page)
    await page.goto("/repositories")
    await expect(page.getByText("Failed to load data.")).toBeVisible()
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible()
  })

  test("retry button triggers new request", async ({ page }) => {
    await mockGitHubAPIError(page)
    await page.goto("/repositories")
    await expect(page.getByText("Failed to load data.")).toBeVisible()

    await page.unroute("**/api.github.com/search/repositories*")
    await mockGitHubAPI(page)

    await page.getByRole("button", { name: "Retry" }).click()
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()
  })

  test("rate-limit banner appears on developers page too", async ({ page }) => {
    await mockGitHubAPIRateLimit(page)
    await page.goto("/developers")
    await expect(page.getByText(/rate limit/i)).toBeVisible()
  })
})
