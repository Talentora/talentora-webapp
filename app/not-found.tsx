import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8 text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
      {/* <img
        src="/placeholder.svg?height=200&width=200"
        alt="404 Illustration"
        width={200}
        height={200}
        className="mb-8"
      /> */}
      <Button asChild>
        <Link href="/">
          Return to Home
        </Link>
      </Button>
    </div>
  )
}