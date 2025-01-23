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
    <section className="w-full px-4 py-8 md:py-16 lg:py-24">
      <div className="text-center space-y-2 md:space-y-4 mb-8 md:mb-12 lg:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          Seamlessly Integrate with Your ATS
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-xl md:max-w-2xl mx-auto px-4">
          Connect with all major Applicant Tracking Systems to streamline your hiring workflow
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
        {integrations.map((integration, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center bg-white p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
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
