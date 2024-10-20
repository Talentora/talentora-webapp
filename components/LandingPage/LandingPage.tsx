import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import AIPowered from '@/components/icons/AIPowered';
import Image1 from '@/components/icons/Wireframe.svg';


import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-['F5F6FA']">
 
 

      <main>
        <section className="container mx-auto px-4 py-16 text-center">
<h1 className="text-4xl md:text-6xl font-bold mb-4 leading-relaxed">
  <span className="text-black">Build your dream team</span> <br />
  <span className="text-black">with</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FB7B54] to-[#FF45C7]">talent</span><span className="font-light text-black">ora</span><span className="text-black">.</span>
</h1>




          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your hiring process with our conversational AI 
            assessments. Find the perfect candidates faster and smarter.
          </p>
          
          <div className="relative w-full max-w-2xl mx-auto aspect-video bg-indigo-600 rounded-lg mb-8 overflow-hidden transform scale-75">
          <div className="absolute top-4 left-4 bg-'F5F6FA rounded-lg shadow-md p-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
                A
              </div>
              <div className="text-left">
                <p className="font-semibold">Header</p>
                <p className="text-xs text-gray-500">Subhead</p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
                A
              </div>
              <div className="text-left">
                <p className="font-semibold">Header</p>
                <p className="text-xs text-gray-500">Subhead</p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
                JD
              </div>
              <div className="text-left">
                <p className="font-semibold">John Doe</p>
                <p className="text-xs text-gray-500">Opened email invite</p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
                A
              </div>
              <div className="text-left">
                <p className="font-semibold">Header</p>
                <p className="text-xs text-gray-500">Subhead</p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full py-2 px-4 flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600">Learn More</span>
            </div>
          </div>
          
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg">
            Request Live Demo
          </Button>
        </section>
        <hr className="my-8 border-gray-300" style={{ marginLeft: '60px', marginRight: '60px' }} />


        <section className="container mx-auto px-4 py-16">
        <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-semibold mb-2 text-black relative inline-block">
  Why Choose Our AI Recruiter?
  
  <span className="block w-16 h-1 bg-gradient-to-r from-[#FB7B54] to-[#FF45C7] absolute left-0 mt-2"></span>
</h2>


</div>


<div className="text-center mt-10">
  <p className="text-lg text-black mb-8 max-w-lg mx-auto">
    Our platform conducts conversational AI interviews with simple and trustworthy software. And candidates love it.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 justify-center px-4 md:px-16">
    {[
      {
        title: "AAIIIIIIIIII-Powered Matching",
        description: "Our advanced algorithms find the best candidates based on skills, experience, and cultural fit.",
        image: "/public/icons/AIPowered.svg?height=100&width=100"
      },
      {
        title: "Lightning Fast Results",
        description: "Reduce time-to-hire by up to 50% with our efficient AI-driven screening process.",
        image: "/Wireframe.svg?height=100&width=100"
      },
      {
        title: "Diverse Talent Pool",
        description: "Access to a wide range of talent from various backgrounds.",
        image: "/placeholder.svg?height=100&width=100"
      }
    ].map((feature, index) => (
      <div 
        key={index} 
        className="p-6 text-center flex flex-col justify-between max-w-xs mx-auto" 
        style={{ border: "1px solid #32BBCDB2", borderRadius: "30px", minHeight: "400px" }} // Increased height
      >
        <h3 className="text-xl font-semibold mb-4 text-black">{feature.title}</h3>
        
        <Image
          src={feature.image}
          alt={feature.title}
          width={100}
          height={100}
          className="mx-auto mb-6"
        />
        
        <p className="text-black mt-auto">{feature.description}</p>
      </div>
    ))}
  </div>
</div>





          <div className="text-center mt-12">
          <Button
  variant="outline"
  size="lg"
  className="rounded-full bg-white border border-black text-black"
>
  Learn More
</Button>

          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-32 h-16 bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                LOGO
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
    
  )
}