import type { RepositorySearchResponse, Contributor } from "../../src/types/github"

export const MOCK_REPOS: RepositorySearchResponse = {
  total_count: 3,
  items: [
    {
      id: 1,
      name: "test-repo-alpha",
      full_name: "org-one/test-repo-alpha",
      html_url: "https://github.com/org-one/test-repo-alpha",
      description: "A test repository for E2E validation",
      stargazers_count: 50000,
      forks_count: 8000,
      open_issues_count: 120,
      license: { name: "MIT License" },
      owner: {
        login: "org-one",
        avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      },
    },
    {
      id: 2,
      name: "test-repo-beta",
      full_name: "dev-user/test-repo-beta",
      html_url: "https://github.com/dev-user/test-repo-beta",
      description: "Second test repository with no license",
      stargazers_count: 30000,
      forks_count: 5000,
      open_issues_count: 45,
      license: null,
      owner: {
        login: "dev-user",
        avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
      },
    },
    {
      id: 3,
      name: "test-repo-gamma",
      full_name: "another-org/test-repo-gamma",
      html_url: "https://github.com/another-org/test-repo-gamma",
      description: null,
      stargazers_count: 10000,
      forks_count: 2000,
      open_issues_count: 10,
      license: { name: "Apache License 2.0" },
      owner: {
        login: "another-org",
        avatar_url: "https://avatars.githubusercontent.com/u/3?v=4",
      },
    },
  ],
}

export const MOCK_CONTRIBUTORS: Contributor[] = [
  {
    id: 101,
    login: "contributor-alice",
    avatar_url: "https://avatars.githubusercontent.com/u/101?v=4",
    contributions: 250,
  },
  {
    id: 102,
    login: "contributor-bob",
    avatar_url: "https://avatars.githubusercontent.com/u/102?v=4",
    contributions: 120,
  },
  {
    id: 103,
    login: "contributor-charlie",
    avatar_url: "https://avatars.githubusercontent.com/u/103?v=4",
    contributions: 45,
  },
]
