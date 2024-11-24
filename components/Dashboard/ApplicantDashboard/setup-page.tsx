'use client'

import { ArrowLeft, Bot, Mic, Radio, Video } from 'lucide-react'
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SetupPage() {
  const [micAllowed, setMicAllowed] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const job = searchParams.get('job')
    if (job) {
      setJobTitle(decodeURIComponent(job))
    }
  }, [searchParams])

  const steps = [
    { icon: Mic, label: 'MIC', active: true },
    { icon: Video, label: 'VIDEO', active: false },
    { icon: Bot, label: 'BOT', active: false },
    { icon: Radio, label: 'START', active: false },
  ]

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#f8f6ff] p-4">
      <div className="mx-auto max-w-2xl">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-4" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Mic Setup</h1>
            </div>
            {jobTitle && (
              <p className="mt-2 text-sm text-muted-foreground">Setting up for: {jobTitle}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex justify-center gap-8">
                {steps.map((step, index) => (
                  <div key={step.label} className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        step.active ? 'bg-[#6366f1] text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-sm ${step.active ? 'text-[#6366f1]' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label htmlFor="mic-access" className="text-sm font-medium">
                  Allow Mic Access?
                </label>
                <Switch
                  id="mic-access"
                  checked={micAllowed}
                  onCheckedChange={setMicAllowed}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mic Input</label>
                <Select defaultValue="macbook">
                  <SelectTrigger>
                    <SelectValue placeholder="Select mic input" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="macbook">MacBook Air 2020</SelectItem>
                    <SelectItem value="airpods">AirPods Pro</SelectItem>
                    <SelectItem value="external">External Microphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Audio Output</label>
                <Select defaultValue="macbook">
                  <SelectTrigger>
                    <SelectValue placeholder="Select audio output" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="macbook">MacBook Air 2020</SelectItem>
                    <SelectItem value="airpods">AirPods Pro</SelectItem>
                    <SelectItem value="speakers">External Speakers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button className="bg-[#6366f1] hover:bg-[#5558e6]">Next</Button>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === 0 ? 'bg-[#6366f1]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}