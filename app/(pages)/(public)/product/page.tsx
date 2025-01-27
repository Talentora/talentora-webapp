'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, BarChart2, Users, FileText, MessageSquare } from 'lucide-react';

const ProductPage = () => {
  return (
    <div className="container mx-auto px-4 pr-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Hiring Process
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Leverage AI-powered tools and data-driven insights to find and hire the best talent faster than ever before.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
          
          <div className="flex justify-center gap-8 mt-12">
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-2" />
              <span className="text-gray-600">14-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-2" />
              <span className="text-gray-600">No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-2" />
              <span className="text-gray-600">Cancel anytime</span>
            </div>
          </div>
        </div>

        <section id="ai-interviews" className="mb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block p-2 bg-blue-100 rounded-lg mb-4">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold mb-6">AI-Powered Interview Assistant</h2>
              <p className="text-xl text-gray-600 mb-6">
                Save hundreds of hours screening candidates with our intelligent AI interview system.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Automated candidate screening with natural language processing',
                  'Personality and skill assessment through video interviews',
                  'Bias-free evaluation metrics',
                  'Custom interview templates for different roles'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Try AI Interviews <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur-xl opacity-50"></div>
              <img 
                src="/ai-interviews-demo.png" 
                alt="AI Interview Platform Interface" 
                className="relative rounded-xl shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </section>

        <section id="assessments" className="mb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl blur-xl opacity-50"></div>
                <video 
                  src="/assessments-demo.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  className="relative rounded-xl shadow-2xl border border-gray-200"
                ></video>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block p-2 bg-green-100 rounded-lg mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Skills Assessment Platform</h2>
              <p className="text-xl text-gray-600 mb-6">
                Evaluate candidates objectively with our comprehensive assessment tools.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Pre-built assessment templates for 100+ roles',
                  'Custom assessment creation tools',
                  'Real-time coding challenges and technical tests',
                  'Detailed performance analytics and benchmarking'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Explore Assessments <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section id="analytics" className="mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Recruitment Analytics</h2>
            <p className="shadow-2xltext-xl text-gray-600">
              Make data-driven decisions with powerful recruitment analytics and insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart2 className="h-8 w-8 text-purple-600" />,
                title: 'Hiring Metrics',
                description: 'Track key metrics like time-to-hire, cost-per-hire, and source effectiveness'
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: 'Candidate Analytics',
                description: 'Analyze candidate pipeline and conversion rates at each stage'
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-green-600" />,
                title: 'Team Performance',
                description: 'Monitor interviewer effectiveness and team collaboration'
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-background p-8 rounded-xl shadow-lg border border-input" style={{ boxShadow: '0 0 25px 5px #5650F0' }}>


                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="collaboration" className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Hiring?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of companies already hiring better with Talentora.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default ProductPage;