'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';
import { getInterviewQuestions } from '@/utils/supabase/queries';

type Question = {
  id: string;
  question: string;
  sample_response: string;
  order: number;
};

interface InterviewQuestionsProps {
  jobId: string;
}

export default function InterviewQuestions({ jobId }: InterviewQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getInterviewQuestions(jobId);
        setQuestions(fetchedQuestions || []);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [jobId]);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const toggleQuestion = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
    }
  };

  return (
    <div className="flex-1">
      <Card className="p-5 bg-foreground border border-border shadow-3xl h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <CardTitle className="text-xl font-semibold">Interview Questions</CardTitle>
            <div className="flex items-center gap-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <Button variant="outline" size="sm" onClick={toggleVisibility}>
                {visible ? 'Hide' : 'Show'} Questions
              </Button>
            </div>
          </div>
        </CardHeader>
        {visible && (
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : questions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No interview questions configured yet
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card 
                    key={question.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">
                        {question.order}. {question.question}
                      </CardTitle>
                    </CardHeader>
                    {expandedQuestion === question.id && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Sample Response:
                        </p>
                        <p className="mt-2 text-sm">
                          {question.sample_response}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
