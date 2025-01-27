'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Users, Target, Shield } from 'lucide-react'

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Pushing boundaries with cutting-edge AI technology to transform recruitment.'
  },
  {
    icon: Users,
    title: 'Human-Centric',
    description: 'Keeping the human element at the heart of recruitment automation.'
  },
  {
    icon: Target,
    title: 'Efficiency',
    description: 'Streamlining processes to save time and improve hiring outcomes.'
  },
  {
    icon: Shield,
    title: 'Trust',
    description: 'Building reliable solutions with transparency and integrity.'
  }
]

const Values = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold  mb-6">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that guide us in building the future of recruitment
          </p>
        </motion.div>

        <div className=" grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Values 