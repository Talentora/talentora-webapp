import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Image1 from './Icons/Image1';
import Image2 from './Icons/Image2';
import Image3 from './Icons/Image3';
import Image8 from './Icons/Image8';
import Image9 from './Icons/Image9';
import Image10 from './Icons/Image10';
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen  to-white">
      <main className="container px-4 mx-auto">

        <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight tracking-tighter lg:text-6xl">
              Find the perfect candidates faster and{" "}
              <span className="text-purple-400">smarter</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-[600px]">
              Streamline your first-round hiring process with our conversational AI
              assessments. Find the perfect candidates faster and smarter.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Pricing
              </Button>
                <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 group"
                >
                Request Live Demo
                <span className="inline-block transition-transform transform group-hover:translate-x-2 ml-2">
                  →
                </span>
                </Button>
            </div>
          </div>
          <div className="relative space-y-6">
            <Card className="p-4 bg-white/80 backdrop-blur shadow-lg max-w-md ml-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Customize Your Interview</h3>
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="w-full bg-white"
              />
            </Card>
            <div className="grid grid-cols-2 gap-6">
              <img
                src='/Images/Image4.jpg'
                alt="Interview process"
                className="rounded-2xl shadow-lg"
                style={{ width: '100%', height: 'auto' }}
              />
              <div className="space-y-4">
                <img
                  src='/Images/Image5.jpg'
                  alt="Team collaboration"
                  width={300}
                  height={300}
                  className="rounded-2xl shadow-lg"
                />
                <Card className="p-4 bg-white/80 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Invite Candidates</h3>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/2] w-full">
          <Image
            src="/Images/Image7.png"
            alt="Descriptive alt text"
            fill
            className="object-cover rounded-lg"
            // sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">About Talentora</h2>
          <p className="text-lg text-muted-foreground">
          Talentora's cutting-edge AI technology uses conversational AI assessments to Hire Smarter, Faster, Better. 
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-primary"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Conversational AI Assessments
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-primary"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sentiment Analysis
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-primary"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              AI-Powered Matching
            </li>
          </ul>
        </div>
      </div>
    </section>

        <section className="container mx-auto px-4 py-16">

        <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-semibold mb-2 text-black relative inline-block">
              Connect with your ATS
              <span className="block w-16 h-1 bg-gradient-to-r from-[#FB7B54] to-[#FF45C7] absolute left-0 mt-2"></span>
            </h2>

            <div className="h-20"></div> {/* Blank space added here */}
            <div className="flex justify-center space-x-24"> {/* Increased space between images */}
              <div className="w-32 h-20 md:w-40 md:h-40"> {/* Increased image size */}
              <Image8 />
              </div>
              <div className="w-32 h-20 md:w-40 md:h-40"> {/* Increased image size */}
              <Image9 />
              </div>
              <div className="w-32 h-20 md:w-40 md:h-40"> {/* Increased image size */}
              <Image10 />
              </div>
            </div>
          </div>
          <div className='h-20'></div>
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-semibold mb-2 text-black relative inline-block">
              Streamline your hiring now
              <span className="block w-16 h-1 bg-gradient-to-r from-[#FB7B54] to-[#FF45C7] absolute left-0 mt-2"></span>
            </h2>
          </div>

            <div className="text-center mt-10">
            <p className="text-lg text-black mb-8 max-w-lg mx-auto">
            Talentora's cutting-edge AI technology uses conversational AI assessments to Hire Smarter, Faster, Better. 
            </p>
            
            <div className="h-10"></div> {/* Blank space added here */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 justify-center px-4 md:px-16">
              <div className="p-6 text-center flex flex-col justify-between max-w-xs mx-auto border border-[#32BBCDB2] rounded-3xl h-[400px]">
              <h3 className="text-xl font-semibold mb-4 text-black">
                AI-Powered Matching
              </h3>

              <Image1 />

                <p className="text-black mt-auto">
                  Our advanced algorithms find the best candidates based on
                  skills, experience, and cultural fit.
                </p>
              </div>
              <div className="p-6 text-center flex flex-col justify-between max-w-xs mx-auto border border-[#32BBCDB2] rounded-3xl h-[400px]">
                <h3 className="text-xl font-semibold mb-4 text-black">
                  Lightning Fast Results
                </h3>

                <Image2 />

                <p className="text-black mt-auto">
                  Reduce time-to-hire by up to 50% with our efficient AI-driven
                  screening process.
                </p>
              </div>
              <div className="p-6 text-center flex flex-col justify-between max-w-xs mx-auto border border-[#32BBCDB2] rounded-3xl h-[400px]">
                <h3 className="text-xl font-semibold mb-4 text-black">
                  Diverse Talent Pool
                </h3>

                <Image3 />

                <p className="text-black mt-auto">
                  Access to a wide range of talent from various backgrounds.
                </p>
              </div>
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

        <section className="py-24">
  <div className="container px-4 mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-5xl font-bold mb-6">
      Intelligent Hiring Made Easy
      <div className="w-32 h-1 bg-purple-600 mx-auto mt-4" />
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      Talentora's cutting-edge AI technology uses conversational AI assessments to Hire Smarter, Faster, Better.
      </p>
    </div>

    <div className="h-20"></div> {/* Blank space added here */}

    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
      <h3 className="text-4xl font-bold text-left">
        Simplify Hiring with AI Precision
      </h3>
      <p className="text-xl text-left text-gray-600">
        Reduce time-to-hire by up to 50% with our efficient AI-driven screening process.
      </p>
      </div>
      <div className="flex justify-center items-center">
        <Image1 />
      </div>
    </div>
  </div>
</section>

<section className="py-24">
  <div className="container px-4 mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="flex justify-center order-2 lg:order-1">
        <Image3 />
      </div>
      <div className="space-y-6 order-1 lg:order-2">
        <h3 className="text-4xl font-bold leading-tight">
          Build Your Dream Team with Talentora
        </h3>
        <p className="text-xl text-gray-600">
          Talentora's conversational AI transforms how you screen, evaluate, and hire. Save time, reduce bias, and make smarter decisions with our intelligent hiring solutions—designed to match top talent with top opportunities.
        </p>
      </div>
    </div>
  </div>
</section>


      </main>
    </div>
  );
}