import ContactForm from '@/components/Contact/ContactForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Talentora',
  description: 'Get in touch with Talentora for any questions about our AI-powered recruitment solutions.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ContactForm />
    </main>
  )
} 