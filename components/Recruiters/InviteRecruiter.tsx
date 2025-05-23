"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Mail, Send } from 'lucide-react'
import { inviteRecruiter } from '@/utils/supabase/queries'

interface InviteRecruiterProps {
  onInviteSent?: () => void
}

export default function InviteRecruiter({ onInviteSent }: InviteRecruiterProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('recruiter')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: inviteError } = await inviteRecruiter(name, email, role)
      
      if (inviteError) {
        setError(inviteError)
        toast.error(inviteError)
        return
      }

      if (data?.success) {
        toast.success('Team member invited successfully!')
        setEmail('')
        setName('')
        setRole('recruiter')
        onInviteSent?.()
      } else {
        setError('Failed to invite team member')
        toast.error('Failed to invite team member')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite team member'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error inviting team member:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invite Team Member
        </CardTitle>
        <CardDescription>
          Send an invitation to a new team member to join your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              'Sending...'
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 