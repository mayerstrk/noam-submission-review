export interface Repository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  license: { name: string } | null
  owner: {
    login: string
    avatar_url: string
  }
}

export interface RepositorySearchResponse {
  total_count: number
  items: Repository[]
}

export interface Contributor {
  id: number
  login: string
  avatar_url: string
  contributions: number
}

export interface Developer {
  login: string
  avatar_url: string
  repoName: string
  repoStars: number
}
