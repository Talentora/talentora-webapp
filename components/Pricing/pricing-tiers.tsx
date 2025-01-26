"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: { monthly: 49, annual: 470 },
    description: "Perfect for small businesses just getting started with AI-powered recruitment.",
    features: [
      "Up to 5 active job postings",
      "AI-powered candidate matching",
      "Basic interview scheduling",
      "Standard support",
    ],
  },
  {
    name: "Professional",
    price: { monthly: 99, annual: 950 },
    description: "Ideal for growing teams with advanced recruitment needs.",
    features: [
      "Up to 15 active job postings",
      "Advanced AI candidate screening",
      "Customizable interview workflows",
      "Priority support",
      "Team collaboration tools",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: 249, annual: 2390 },
    description: "For large organizations with complex hiring processes.",
    features: [
      "Unlimited job postings",
      "Full AI recruitment suite",
      "Advanced analytics and reporting",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
  },
]

export default function PricingTiers() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center space-x-4">
        <span className={`text-sm ${!isAnnual ? "font-bold" : ""}`}>Monthly</span>
        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} aria-label="Toggle annual pricing" />
        <span className={`text-sm ${isAnnual ? "font-bold" : ""}`}>
          Annual
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </span>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold mb-4">
                ${isAnnual ? tier.price.annual : tier.price.monthly}
                <span className="text-sm font-normal text-muted-foreground">/{isAnnual ? "year" : "month"}</span>
              </div>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Choose {tier.name}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}