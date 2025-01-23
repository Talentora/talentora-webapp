import FAQSection from '@/components/HelpCenter/FAQSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center | Talentora',
  description: 'Find answers to common questions and get support for Talentora.',
}

export default function HelpPage() {
  return (
    <main className="min-h-screen">
      <FAQSection />
    </main>
  )
} 