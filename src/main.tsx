import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { routeTree } from "./routeTree.gen"
import { DEFAULT_GC_TIME, PERSIST_MAX_AGE } from "@/lib/constants"
import "hover-tilt/web-component"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DEFAULT_GC_TIME,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})

const router = createRouter({
  routeTree,
  defaultPreload: "viewport",
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: PERSIST_MAX_AGE }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </StrictMode>,
)
