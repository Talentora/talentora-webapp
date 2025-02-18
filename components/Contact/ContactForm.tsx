'use client'

import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Form, FormControl, FormLabel, FormMessage, FormItem, FormField } from '@/components/ui/form'
import { Button } from '../ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const ContactForm = () => {
  const { toast } = useToast()
  const supabase = createClient()
  
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
    company: z.string().optional(),
    role: z.string().optional()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      company: '',
      role: ''
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#demo') {
      form.reset({
        subject: 'Demo Request',
        message: 'I would like to request a demo of Talentora\'s AI-powered recruitment platform.',
      })
    }
  }, [form])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      alert('submitting message')
      const { error } = await supabase
        .from('form_messages')
        .insert([{
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          company: values.company,
          role: values.role,
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
        variant: "default",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isDemoRequest = typeof window !== 'undefined' && window.location.hash === '#demo'

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">
              {isDemoRequest ? 'Request a Demo' : 'Get in Touch'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isDemoRequest 
                ? 'Experience how our AI-powered platform can transform your hiring.'
                : 'Questions about our solutions? We\'d love to hear from you.'}
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="bg-background p-4 rounded-lg shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:contact@talentora.ai" className="text-gray-600 hover:text-purple-600">
                      contact@talentora.ai
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+1234567890" className="text-gray-600 hover:text-purple-600">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isDemoRequest && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <Input placeholder="Your role" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Input placeholder="Your message..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {isDemoRequest ? 'Request Demo' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactForm