import { test, expect } from "@playwright/test"
import { clearPersistedState } from "./helpers/api-mock"
import { MOCK_REPOS, MOCK_CONTRIBUTORS } from "./fixtures/mock-data"

test.describe("API Layer", () => {
  test.beforeEach(async ({ page }) => {
    await clearPersistedState(page)
  })

  test("repositories page calls correct endpoint with params", async ({ page }) => {
    const requests: string[] = []
    await page.route("**/api.github.com/**", (route) => {
      requests.push(route.request().url())
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPOS),
      })
    })

    await page.goto("/repositories")
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()

    const repoRequest = requests.find((u) => u.includes("/search/repositories"))
    expect(repoRequest).toBeDefined()
    const url = new URL(repoRequest!)
    expect(url.searchParams.get("q")).toBe("language:javascript")
    expect(url.searchParams.get("sort")).toBe("stars")
    expect(url.searchParams.get("order")).toBe("desc")
    expect(url.searchParams.get("per_page")).toBe("10")
  })

  test("contributors API is NOT called until modal opens", async ({ page }) => {
    const requests: string[] = []
    await page.route("**/api.github.com/search/repositories*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPOS),
      }),
    )
    await page.route("**/api.github.com/repos/**/contributors*", (route) => {
      requests.push(route.request().url())
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CONTRIBUTORS),
      })
    })

    await page.goto("/repositories")
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()
    expect(requests.filter((u) => u.includes("/contributors"))).toHaveLength(0)

    await page.getByRole("button", { name: "View Contributors" }).first().click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByText("contributor-alice")).toBeVisible()
    expect(requests.filter((u) => u.includes("/contributors")).length).toBeGreaterThanOrEqual(1)
  })

  test("contributors modal displays total contributor count", async ({ page }) => {
    await page.route("**/api.github.com/search/repositories*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPOS),
      }),
    )
    await page.route("**/api.github.com/repos/**/contributors*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CONTRIBUTORS),
      }),
    )

    await page.goto("/repositories")
    await page.getByRole("button", { name: "View Contributors" }).first().click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByText(`(${MOCK_CONTRIBUTORS.length})`)).toBeVisible()
  })

  test("contributors request uses correct repo full_name", async ({ page }) => {
    const contributorUrls: string[] = []
    await page.route("**/api.github.com/search/repositories*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPOS),
      }),
    )
    await page.route("**/api.github.com/repos/**/contributors*", (route) => {
      contributorUrls.push(route.request().url())
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CONTRIBUTORS),
      })
    })

    await page.goto("/repositories")
    await page.getByRole("button", { name: "View Contributors" }).first().click()
    await expect(page.getByText("contributor-alice")).toBeVisible()

    const expectedRepo = MOCK_REPOS.items[0].full_name
    const matchingUrl = contributorUrls.find((u) => u.includes(`/repos/${expectedRepo}/contributors`))
    expect(matchingUrl).toBeDefined()
  })

  test("403 with rate-limit header throws RateLimitError (no retry)", async ({ page }) => {
    let requestCount = 0
    await page.route("**/api.github.com/search/repositories*", (route) => {
      requestCount++
      return route.fulfill({
        status: 403,
        contentType: "application/json",
        headers: { "x-ratelimit-remaining": "0" },
        body: JSON.stringify({ message: "API rate limit exceeded" }),
      })
    })

    await page.goto("/repositories")
    await expect(page.getByText(/rate limit/i)).toBeVisible()
    const initialCount = requestCount
    await page.waitForTimeout(1000)
    // No retries after rate-limit — count should not grow beyond initial requests
    // (StrictMode may cause 2 initial mounts, so we check no growth, not exact count)
    expect(requestCount).toBe(initialCount)
  })

  test("403 with rate-limit message (no header) is still detected", async ({ page }) => {
    await page.route("**/api.github.com/search/repositories*", (route) =>
      route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ message: "API rate limit exceeded for your IP" }),
      }),
    )

    await page.goto("/repositories")
    await expect(page.getByText(/rate limit/i)).toBeVisible()
  })

  test("non-rate-limit 403 shows generic error (not rate-limit banner)", async ({ page }) => {
    await page.route("**/api.github.com/search/repositories*", (route) =>
      route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ message: "Forbidden - access denied" }),
      }),
    )

    await page.goto("/repositories")
    await expect(page.getByText("Failed to load data.")).toBeVisible()
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible()
  })

  test("developers page reuses same repository query (no extra API call)", async ({ page }) => {
    let requestCount = 0
    await page.route("**/api.github.com/search/repositories*", (route) => {
      requestCount++
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPOS),
      })
    })

    await page.goto("/repositories")
    await expect(page.getByRole("button", { name: "View Contributors" }).first()).toBeVisible()
    const afterRepos = requestCount

    await page.getByRole("link", { name: "developers" }).click()
    await expect(page.getByAltText(MOCK_REPOS.items[0].owner.login)).toBeVisible()

    expect(requestCount).toBe(afterRepos)
  })

  test("500 error triggers retries then shows error state", async ({ page }) => {
    let requestCount = 0
    await page.route("**/api.github.com/search/repositories*", (route) => {
      requestCount++
      return route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      })
    })

    await page.goto("/repositories")
    await expect(page.getByText("Failed to load data.")).toBeVisible()
    expect(requestCount).toBeGreaterThan(1)
  })
})
