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
    <section className="container mx-auto px-4 py-24">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl font-bold">
          Seamlessly Integrate with Your ATS
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with all major Applicant Tracking Systems to streamline your hiring workflow
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-8 max-w-5xl mx-auto">
        {integrations.map((integration, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 flex items-center justify-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Image 
              src={integration.logo || "/placeholder.svg"} 
              alt={`${integration.name} logo`} 
              width={140} 
              height={70} 
              className="max-w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300" 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
