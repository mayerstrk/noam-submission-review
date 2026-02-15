import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Navbar } from "@/components/Navbar"
import { NotFound } from "@/components/NotFound"

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-3">
          <Navbar />
        </div>
      </header>
      <main className="py-6">
        <Outlet />
      </main>
    </div>
  )
}
