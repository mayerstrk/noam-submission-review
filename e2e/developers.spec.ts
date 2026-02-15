import { test, expect } from "@playwright/test"
import { mockGitHubAPI, clearPersistedState } from "./helpers/api-mock"
import { MOCK_REPOS } from "./fixtures/mock-data"

test.describe("Developers Page", () => {
  test.beforeEach(async ({ page }) => {
    await clearPersistedState(page)
    await mockGitHubAPI(page)
    await page.goto("/developers")
  })

  test("renders correct number of developer cards", async ({ page }) => {
    const avatars = page.getByRole("img").filter({ hasNot: page.locator("svg") })
    const cardAvatars = page.locator("main img.rounded-full")
    await expect(cardAvatars).toHaveCount(MOCK_REPOS.items.length)
  })

  test("card shows developer name, repo name, and stars", async ({ page }) => {
    const repo = MOCK_REPOS.items[0]
    await expect(page.getByText(repo.owner.login).first()).toBeVisible()
    await expect(page.getByText(repo.name).first()).toBeVisible()
    await expect(page.getByText(repo.stargazers_count.toLocaleString()).first()).toBeVisible()
  })

  test("card shows avatar image", async ({ page }) => {
    const repo = MOCK_REPOS.items[0]
    const avatar = page.getByAltText(repo.owner.login)
    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveAttribute("src", repo.owner.avatar_url)
  })

  test("cards are in a horizontal scroll container", async ({ page }) => {
    const scrollContainer = page.locator("main .overflow-x-auto")
    await expect(scrollContainer).toBeVisible()
    const display = await scrollContainer.locator("> div").evaluate((el) => getComputedStyle(el).display)
    expect(display).toBe("flex")
  })
})
