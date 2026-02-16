import axios from "axios"

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
})

export default apiClient
