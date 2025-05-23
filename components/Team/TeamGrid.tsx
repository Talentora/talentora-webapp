'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, Twitter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Database } from "@/types/types_db"

type Recruiter = Database["public"]["Tables"]["recruiters"]["Row"]

interface TeamGridProps {
  recruiters: Recruiter[]
}

export function TeamGrid({ recruiters }: TeamGridProps) {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'pending_invite':
        return 'bg-yellow-500'
      case 'invite_expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'pending_invite':
        return 'Pending Invite'
      case 'invite_expired':
        return 'Invite Expired'
      default:
        return 'Unknown'
    }
  }

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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recruiters.map((recruiter) => (
            <Card key={recruiter.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {recruiter.full_name || 'Unnamed Recruiter'}
                </CardTitle>
                <Badge className={getStatusColor(recruiter.status)}>
                  {getStatusText(recruiter.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${recruiter.email}`} />
                    <AvatarFallback>{recruiter.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{recruiter.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {recruiter.status === 'active' ? 'Team Member' : 'Pending Team Member'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamGrid 