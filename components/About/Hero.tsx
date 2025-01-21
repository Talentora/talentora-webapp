'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const AboutHero = () => {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revolutionizing recruitment through AI-powered solutions that connect great talent with amazing opportunities.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-semibold mb-6">
              Transforming Recruitment
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We're on a mission to make recruitment more efficient, fair, and effective through cutting-edge AI technology. Our platform helps recruiters focus on what matters most - building meaningful connections with candidates.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[400px]"
          >
            <Image
              src="/about/mission.jpg"
              alt="Our Mission"
              fill
              className="object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero 