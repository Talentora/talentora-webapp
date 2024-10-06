import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  About RoboRecruiter
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  We're on a mission to revolutionize the hiring experience using AI.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Award className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Our Mission</h3>
                  <p className="text-center text-muted-foreground">
                    To deliver cutting-edge solutions that empower businesses to hire their best candidates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Users className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Our Team</h3>
                  <p className="text-center text-muted-foreground">
                    A diverse group of students that hope to revolutionize hiring.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Clock className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Our History</h3>
                  <p className="text-center text-muted-foreground">
                    Founded in 2024, we're a agile group of builders hoping to make a lasting impact on the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Meet Our Leadership
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <TeamMember
                name="Jane Doe"
                role="CEO & Founder"
                imageSrc="/placeholder.svg?height=400&width=400"
              />
              <TeamMember
                name="John Smith"
                role="CTO"
                imageSrc="/placeholder.svg?height=400&width=400"
              />
              <TeamMember
                name="Emily Johnson"
                role="COO"
                imageSrc="/placeholder.svg?height=400&width=400"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Story</h2>
                <p className="text-muted-foreground">
                  Founded in 2010, our company began with a simple idea: to create innovative solutions that make a difference. 
                  Over the years, we've grown from a small team of dreamers to a global organization, but our core mission remains the same.
                </p>
                <p className="text-muted-foreground">
                  We've faced challenges, celebrated victories, and learned valuable lessons along the way. 
                  Our journey is a testament to the power of perseverance, creativity, and teamwork.
                </p>
                {/* <Button className="mt-4">Learn More About Our Journey</Button> */}
              </div>
              <div className="aspect-video overflow-hidden rounded-xl">
                <Image
                  alt="Company timeline"
                  className="object-cover"
                  height="400"
                  src="/placeholder.svg?height=400&width=600"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>

        
      </main>
    </div>
  )
}

function TeamMember({ name, role, imageSrc }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Image
        alt={name}
        className="rounded-full object-cover"
        height="150"
        src={imageSrc}
        style={{
          aspectRatio: "150/150",
          objectFit: "cover",
        }}
        width="150"
      />
      <div className="text-center">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}