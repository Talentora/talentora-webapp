import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, Cpu, Users, Zap } from "lucide-react"
import Link from "next/link"
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AI-Powered Recruiting
                  <span className="text-primary"> Simplified</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Streamline your hiring process with our cutting-edge AI recruiter. Find the perfect candidates faster and smarter.
                </p>
              </div>
              <div className="space-x-4">
              <Link href="/signin/signup">
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
              <Link href="/about">
              <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Why Choose Our AI Recruiter?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Cpu className="h-10 w-10 text-primary" />}
                title="AI-Powered Matching"
                description="Our advanced algorithms find the best candidates based on skills, experience, and cultural fit."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Lightning-Fast Results"
                description="Reduce time-to-hire by up to 50% with our efficient AI-driven screening process."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Diverse Talent Pool"
                description="Access a wide range of qualified candidates from various backgrounds and industries."
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Hiring?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of companies already using our AI recruiter to find top talent.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Link href="/signin/signup">
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </form>
                
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 border border-border rounded-lg shadow-sm">
      {icon}
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}