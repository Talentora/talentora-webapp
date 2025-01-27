'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, Twitter } from 'lucide-react'

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-founder',
    image: '/team/sarah.jpg',
    bio: 'Former tech executive with 15+ years in recruitment technology.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: '/team/michael.jpg',
    bio: 'AI researcher and engineer with expertise in machine learning.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product',
    image: '/team/emily.jpg',
    bio: 'Product leader focused on creating intuitive user experiences.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'David Kim',
    role: 'Lead Engineer',
    image: '/team/david.jpg',
    bio: 'Full-stack developer with a passion for scalable solutions.',
    linkedin: '#',
    twitter: '#'
  }
]

const TeamGrid = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind Talentora
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background border border-input rounded-xl shadow-sm overflow-hidden"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 mb-4">
                  {member.bio}
                </p>
                <div className="flex space-x-4">
                  <a
                    href={member.linkedin}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.twitter}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamGrid 