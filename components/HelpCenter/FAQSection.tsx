"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What is Talentora?',
    answer: 'Talentora is an AI-powered recruitment platform that helps companies streamline their hiring process through automation, intelligent candidate screening, and advanced analytics.'
  },
  {
    question: 'How does the AI screening work?',
    answer: 'Our AI technology analyzes resumes and applications using natural language processing to match candidates with job requirements. It considers skills, experience, and qualifications while eliminating bias from the screening process.'
  },
  {
    question: 'Is Talentora suitable for small businesses?',
    answer: 'Yes! Talentora is designed to scale with your needs. We offer flexible plans suitable for businesses of all sizes, from startups to enterprise organizations.'
  },
  {
    question: 'Can I integrate Talentora with my existing ATS?',
    answer: 'Yes, Talentora integrates seamlessly with most major Applicant Tracking Systems. Our team can help you set up the integration during the onboarding process.'
  },
  {
    question: 'How secure is my data with Talentora?',
    answer: 'We take data security seriously. Talentora uses enterprise-grade encryption and follows strict data protection protocols to ensure your information is always secure.'
  }
]

const FAQSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Talentora
          </p>
        </motion.div>

        <Accordion type="single" defaultValue="0">
          {faqs.map((faq, index) => (
            <AccordionItem value={index.toString()} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQSection 