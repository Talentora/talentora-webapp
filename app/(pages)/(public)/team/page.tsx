import TeamGrid from '@/components/Team/TeamGrid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Team | Talentora',
  description: 'Meet the passionate team behind Talentora - leaders in AI-powered recruitment solutions.',
}

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      <TeamGrid />
    </main>
  )
} 