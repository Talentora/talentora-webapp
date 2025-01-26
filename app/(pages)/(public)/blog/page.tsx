import BlogGrid from '@/components/Blog/BlogGrid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Talentora',
  description: 'Stay updated with the latest insights and trends in AI-powered recruitment.',
}

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <BlogGrid />
    </main>
  )
} 