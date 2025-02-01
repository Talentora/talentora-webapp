"use client"
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Recruitment',
    excerpt: 'Explore how artificial intelligence is transforming the recruitment industry and what it means for hiring managers.',
    image: '/blog/ai-recruitment.jpg',
    date: 'March 15, 2024',
    readTime: '5 min read',
    category: 'Technology'
  },
  {
    id: 2,
    title: 'Best Practices for Remote Hiring',
    excerpt: 'Learn the essential strategies and tools for successful remote recruitment in the modern workplace.',
    image: '/blog/remote-hiring.jpg',
    date: 'March 10, 2024',
    readTime: '4 min read',
    category: 'Hiring'
  },
  {
    id: 3,
    title: 'Diversity and Inclusion in Tech Recruitment',
    excerpt: 'How to build inclusive hiring practices and create diverse tech teams that drive innovation.',
    image: '/blog/diversity.jpg',
    date: 'March 5, 2024',
    readTime: '6 min read',
    category: 'DEI'
  },
  {
    id: 4,
    title: 'Streamlining Your Recruitment Process',
    excerpt: 'Tips and techniques to optimize your hiring pipeline and improve candidate experience.',
    image: '/blog/process.jpg',
    date: 'March 1, 2024',
    readTime: '4 min read',
    category: 'Process'
  }
]

const BlogGrid = () => {
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
            Latest Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends and insights in recruitment and AI technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {post.readTime}
                  </div>
                </div>

                <Link href={`/blog/${post.id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogGrid 