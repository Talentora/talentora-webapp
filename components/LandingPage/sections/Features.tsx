import { Camera, Zap, Users, Lock, BarChart, Clock } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: "AI Video Interviews",
    description: "Automated interviews with natural conversation flow and real-time candidate assessment."
  },
  {
    icon: BarChart,
    title: "Skills Assessment", 
    description: "In-depth evaluation of technical and soft skills through AI-powered analysis."
  },
  {
    icon: Clock,
    title: "24/7 Screening",
    description: "Continuous candidate screening and evaluation, regardless of time zones."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share candidate insights and make decisions together with your hiring team."
  }
]

export default function Features() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 ">
        <div className="text-center mb-16">
        <h1 className="text-5xl font-bold leading-tight tracking-tighter lg:text-4xl xl:text-5xl">
          The
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"></span> Future of Hiring is Here
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl pt-4 mx-auto ">
            Our AI-powered platform revolutionizes the screening process, saving you countless hours while finding better candidates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] rounded-2xl p-5 shadow-lg shadow-[#5650F0]/20 hover:shadow-xl hover:shadow-[#5650F0]/20 transition-shadow border border-accent/20"
            >
              <feature.icon className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
