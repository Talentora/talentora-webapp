import AboutHero from '@/components/About/Hero'
import Values from '@/components/About/Values'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Talentora',
  description: 'Learn about our mission to revolutionize recruitment through AI-powered solutions.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <Values />
    </main>
  )
} 