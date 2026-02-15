import { Link } from "@tanstack/react-router"
import { Home } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CARD_BASE_WIDTH } from "@/lib/card-styles"

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <hover-tilt
        tilt-factor="0.5"
        scale-factor="1.03"
        glare-intensity="1.3"
        glare-hue="217"
        glare-mask-mode="luminance"
        blend-mode="soft-light"
        shadow
      >
        <Card className={`${CARD_BASE_WIDTH} text-center`}>
          <CardHeader>
            <CardTitle className="text-7xl font-black tracking-tighter text-primary sm:text-8xl">
              404
            </CardTitle>
            <CardDescription className="text-lg font-medium text-foreground/80">
              Page not found
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              This is not the page you are looking for 🤖
            </p>
          </CardContent>

          <CardFooter>
            <Button
              variant="outline"
              className="w-full font-semibold hover:bg-primary/10 hover:text-primary sm:text-base"
              asChild
            >
              <Link to="/repositories">
                <Home className="h-4 w-4" />
                Back to Repositories
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </hover-tilt>
    </div>
  )
}
