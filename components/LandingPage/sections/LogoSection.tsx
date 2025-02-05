import Image from 'next/image'

const integrations = [
  { name: "Workday", logo: "/LandingPage/workday.png" },
  { name: "Greenhouse", logo: "/LandingPage/greenhouse.png" },
  { name: "Lever", logo: "/LandingPage/lever.png" },
//   { name: "Jobvite", logo: "/LandingPage/jobvite.png" },
  { name: "iCIMS", logo: "/LandingPage/icims.png" },
  { name: "Bullhorn", logo: "/LandingPage/bullhorn.png" },
  { name: "JazzHR", logo: "/LandingPage/jazzhr.jpg" },
  { name: "BambooHR", logo: "/LandingPage/bamboohr.png" },
  { name: "Ashby", logo: "/LandingPage/ashby.jpg" }
];

export function LogoSection() {
  return (
    <section className="w-full px-4 py-8 md:py-16 lg:py-24" id="ats-integrations">
      <div className="text-center space-y-2 md:space-y-4 mb-8 md:mb-12 lg:mb-16">
        <h2 className="text-5xl tracking-tighter md:text-4xl lg:text-5xl font-bold">
          Integrates with Your ATS System
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-xl md:max-w-2xl mx-auto px-4">
          Connect with all major Applicant Tracking Systems to streamline your hiring workflow
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-2 lg:gap-4 max-w-xs sm:max-w-6xl md:max-w-6xl mx-auto">
        {integrations.map((integration, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center over:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] border border-input p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-md shadow-[#5650F0]/20 hover:shadow-lg hover:shadow-[#5650F0]/20 transition-shadow duration-300"
          >
            <div className="relative w-full aspect-[3/2]">
              <Image 
                src={integration.logo || "/placeholder.svg"} 
                alt={`${integration.name} logo`}
                fill
                className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
