'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Pencil, Loader2, Sparkles } from 'lucide-react';
import {
  createInterviewQuestion,
  getInterviewQuestions,
  updateInterviewQuestion,
  deleteInterviewQuestion
} from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { Tables } from '@/types/types_db';

interface QuestionSetupProps {
  jobId: string;
  onCompletion: (isComplete: boolean) => void;
  existingConfig?: Tables<'job_interview_config'> | null;
}

type Question = {
  id: string;
  question: string;
  sample_response: string;
  order: number;
};

interface InterviewCard {
  questionData: Question;
  onUpdate: (id: string, data: Partial<Question>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const QuestionSetup = ({ jobId, onCompletion, existingConfig }: QuestionSetupProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [responseExample, setResponseExample] = useState('');
  const [loading, setLoading] = useState(true);
  const [showQuestionCard, setShowQuestionCard] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const { toast } = useToast();

  const showErrorToast = useCallback((message: string) => {
    toast({
      title: message,
      description: 'Please try again later.',
      variant: 'destructive'
    });
  }, [toast]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getInterviewQuestions(jobId);
        setQuestions(fetchedQuestions || []);
      } catch (error) {
        showErrorToast('Error loading questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [jobId, showErrorToast]);

  useEffect(() => {
    if (questions.length > 0 && !loading) {
      onCompletion(true);
    }
  }, [questions.length, loading, onCompletion]);

  const handleAddQuestion = useCallback(async () => {
    if (!newQuestion || !responseExample) return;
    setIsAddingQuestion(true);
    try {
      const newEntry = await createInterviewQuestion(
        newQuestion,
        responseExample,
        questions.length + 1,
        jobId
      );
      setQuestions((prev) => [...prev, newEntry]);
      setNewQuestion('');
      setResponseExample('');
      toast({ title: 'Question added successfully' });
    } catch (error) {
      showErrorToast('Failed to add question');
    } finally {
      setIsAddingQuestion(false);
    }
  }, [newQuestion, responseExample, questions.length, showErrorToast, toast, jobId]);

  const handleGenerateQuestion = useCallback(async () => {
    setIsGeneratingQuestion(true);
    try {
      const generatedQuestion = await generateQuestionFromAI();
      toast({
        title: 'AI-generated question',
        description: 'New question added'
      });
      setNewQuestion(generatedQuestion);
      setResponseExample('');
      setQuestions((prev) => [...prev, { id: '', question: generatedQuestion, sample_response: '', order: questions.length + 1 }]);
      // Ensure the new question is displayed in the editor
      setShowQuestionCard(true);
    } catch (error) {
      showErrorToast('Error generating question');
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [jobId, questions.length, showErrorToast, toast]);

  const generateQuestionFromAI = async (): Promise<string> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve('Describe your teamwork experience.'), 1000)
    );
  };

  return (
    <div className="space-y-4 m-10">
      <h2 className="text-2xl font-bold">Setup Interview Questions</h2>
      <div className="mt-4 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => (
              <InterviewCard
                key={q.id}
                questionData={q}
                onUpdate={async (id, updatedData) => {
                  try {
                    const updatedQuestions = questions.map((item) =>
                      item.id === id ? { ...item, ...updatedData } : item
                    );
                    await updateInterviewQuestion(id, jobId, updatedData);
                    setQuestions(updatedQuestions);
                    toast({ title: 'Question updated' });
                  } catch (error) {
                    showErrorToast('Error updating question');
                  }
                }}
                onDelete={async (id) => {
                  try {
                    await deleteInterviewQuestion(id, jobId);
                    setQuestions(questions.filter((q) => q.id !== id));
                    toast({ title: 'Question deleted' });
                  } catch (error) {
                    showErrorToast('Error deleting question');
                  }
                }}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        {!showQuestionCard ? (
          <Button
            className="bg-primary-dark text-white"
            onClick={() => setShowQuestionCard(true)}
          >
            New Question +
          </Button>
        ) : (
          <Card className="p-4 bg-purple-50 shadow-lg border border-black">
            <CardHeader>
              <Textarea
                placeholder="Enter question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Sample response"
                value={responseExample}
                onChange={(e) => setResponseExample(e.target.value)}
              />
              <div className="flex justify-between mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowQuestionCard(false)}
                >
                  Cancel
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddQuestion}
                    disabled={isAddingQuestion}
                  >
                    {isAddingQuestion ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      'Add Question'
                    )}
                  </Button>
                  <Button
                    onClick={handleGenerateQuestion}
                    disabled={isGeneratingQuestion}
                  >
                    {isGeneratingQuestion ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Sparkles />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const InterviewCard = ({ questionData, onUpdate, onDelete }: InterviewCard) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(questionData.question);
  const [editedResponse, setEditedResponse] = useState(questionData.sample_response);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(questionData.id, {
        question: editedQuestion,
        sample_response: editedResponse
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(questionData.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-4 bg-white shadow-lg border border-black">
      {isEditing ? (
        <>
          <Input
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
          />
          <Textarea
            value={editedResponse}
            onChange={(e) => setEditedResponse(e.target.value)}
          />
          <div className="flex justify-end mt-4 space-x-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <CardHeader
            onClick={() => setIsClicked(!isClicked)}
            className="cursor-pointer flex flex-row justify-between"
          >
            <CardTitle className="hover:opacity-75 transition-opacity">
              {questionData.order}. {questionData.question}
            </CardTitle>
            <Pencil
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="opacity-10 hover:opacity-100 transition-opacity"
            />
          </CardHeader>
          {isClicked && (
            <CardContent>
              <p>{questionData.sample_response}</p>
            </CardContent>
          )}
        </>
      )}
    </Card>
  );
};

export default QuestionSetup;
