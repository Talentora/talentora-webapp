import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the pricing work?",
    answer:
      "Our pricing is based on a monthly or annual subscription model. You can choose the plan that best fits your needs and pay either monthly or annually. Annual plans come with a 20% discount.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the new lower price will take effect at the start of the next billing cycle.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial on all our plans. You can test out all the features before committing to a paid subscription.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, including Visa, MasterCard, and American Express. We also support payment via PayPal and invoice for annual Enterprise plans.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied with our service within the first 30 days of your paid subscription, we'll provide a full refund.",
  },
]

export default function PricingFAQ() {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
