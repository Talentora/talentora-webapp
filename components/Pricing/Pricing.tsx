import type { Metadata } from "next"
import PricingTiers from "@/components/Pricing/pricing-tiers"
import PricingFAQ from "@/components/Pricing/pricing-faq"

export const metadata: Metadata = {
  title: "Pricing | TalentHire",
  description: "Choose the perfect plan for your recruitment needs",
}

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Perfect Plan</h1>
      <p className="text-xl text-center text-muted-foreground mb-16">
        Scale your recruitment efforts with our flexible pricing options
      </p>
      <PricingTiers />
      <PricingFAQ />
    </div>
  )
}

