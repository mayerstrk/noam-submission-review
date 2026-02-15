import { test, expect } from "@playwright/test"
import { mockGitHubAPI, clearPersistedState } from "./helpers/api-mock"
import { MOCK_REPOS, MOCK_CONTRIBUTORS } from "./fixtures/mock-data"

test.describe("Repositories Page", () => {
  test.beforeEach(async ({ page }) => {
    await clearPersistedState(page)
    await mockGitHubAPI(page)
    await page.goto("/repositories")
  })

  test("renders correct number of repo cards", async ({ page }) => {
    const buttons = page.getByRole("button", { name: "View Contributors" })
    await expect(buttons).toHaveCount(MOCK_REPOS.items.length)
  })

  test("card shows all required fields", async ({ page }) => {
    const repo = MOCK_REPOS.items[0]
    await expect(page.getByRole("link", { name: repo.name })).toBeVisible()
    await expect(page.getByText(repo.stargazers_count.toLocaleString())).toBeVisible()
    await expect(page.getByText(repo.description!)).toBeVisible()
    await expect(page.getByText(repo.license!.name)).toBeVisible()
    await expect(page.getByText(`${repo.forks_count.toLocaleString()} forks`)).toBeVisible()
    await expect(page.getByText(`${repo.open_issues_count.toLocaleString()} open issues`)).toBeVisible()
  })

  test("repo name links to GitHub", async ({ page }) => {
    const repo = MOCK_REPOS.items[0]
    const link = page.getByRole("link", { name: repo.name })
    await expect(link).toHaveAttribute("href", repo.html_url)
  })

  test("null license shows 'No license'", async ({ page }) => {
    await expect(page.getByText("No license", { exact: true })).toBeVisible()
  })

  test("null description shows 'No description'", async ({ page }) => {
    await expect(page.getByText("No description")).toBeVisible()
  })

  test("View Contributors opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "View Contributors" }).first().click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Contributors" })).toBeVisible()
  })

  test("modal shows contributor data", async ({ page }) => {
    await page.getByRole("button", { name: "View Contributors" }).first().click()
    const dialog = page.getByRole("dialog")

    for (const contributor of MOCK_CONTRIBUTORS) {
      await expect(dialog.getByText(contributor.login)).toBeVisible()
      await expect(dialog.getByText(`${contributor.contributions.toLocaleString()} +`)).toBeVisible()
      await expect(dialog.getByAltText(contributor.login)).toBeVisible()
    }
  })

  test("modal closes on close button", async ({ page }) => {
    await page.getByRole("button", { name: "View Contributors" }).first().click()
    await expect(page.getByRole("dialog")).toBeVisible()

    await page.getByRole("button", { name: "Close" }).click()
    await expect(page.getByRole("dialog")).toBeHidden()
  })
})
