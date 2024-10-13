import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play } from "lucide-react"

export default function InterviewResponses() {
  const questions = [
    "Describe a challenging project you've worked on.",
    "How do you approach problem-solving?",
    "What are your career goals?"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Responses</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="question1">
          <TabsList className="grid w-full grid-cols-3">
            {questions.map((_, index) => (
              <TabsTrigger key={index} value={`question${index + 1}`}>Question {index + 1}</TabsTrigger>
            ))}
          </TabsList>
          {questions.map((question, index) => (
            <TabsContent key={index} value={`question${index + 1}`} className="mt-4">
              <h3 className="font-semibold mb-2">{question}</h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Play className="w-12 h-12 text-muted-foreground" />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}