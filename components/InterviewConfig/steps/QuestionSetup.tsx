"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { createInterviewQuestion, getInterviewQuestions, updateInterviewQuestion, deleteInterviewQuestion } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';

export const QuestionSetup = () => {
  const [questions, setQuestions] = useState<{ id: string; question: string; response: string; order: number }[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [responseExample, setResponseExample] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [showQuestionCard, setShowQuestionCard] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const jobId = 'e92e6687-aeb5-45e4-8439-c8b598ee41d6';
  const { toast } = useToast();


  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowQuestionCard(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await getInterviewQuestions();
        setQuestions(fetchedQuestions);
        toast({
          title: "Questions loaded successfully",
          description: "All interview questions have been retrieved",
        });
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error loading questions",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      } finally {
        setLoadingQuestions(false);
      }
    };
    loadQuestions();
  }, [toast]);

  const handleAddQuestion = async () => {
    if (newQuestion && responseExample) {
      setSavingQuestion(true);
      try {
        const createdQuestion = await createInterviewQuestion(
          newQuestion,
          responseExample,
          questions.length + 1,
          jobId
        );
        
        setQuestions([...questions, createdQuestion]);
        setNewQuestion('');
        setResponseExample('');
        setShowQuestionCard(false);
        toast({
          title: "Question added successfully",
          description: "Your new interview question has been created",
        });
      } catch (error) {
        console.error('Error adding question:', error);
        toast({
          title: "Error adding question",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      } finally {
        setSavingQuestion(false);
      }
    }
  };

  const handleGenerateQuestion = async () => {
    setLoading(true);
    try {
      // Replace with your AI question generation logic
      const generatedQuestion = await generateQuestionFromAI(); // Placeholder function
      setNewQuestion(generatedQuestion);
      toast({
        title: "Question generated successfully",
        description: "AI has generated a new question for you",
      });
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: "Error generating question",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQuestionFromAI = async (): Promise<string> => {
    // Simulate an AI call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('What is your experience with team collaboration?');
      }, 1000);
    });
  };

  return (
    <div className="space-y-4 m-10">
      <h2 className="text-2xl font-bold">Setup Interview Questions</h2>

      <div className="mt-4 max-h-[400px] overflow-y-auto">
        {loadingQuestions ? (
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
                id={q.id}
                question={q.question} 
                response={q.sample_response} // Updated to match DB column name
                order={q.order}
                onUpdate={async (id, updatedData) => {
                  try {
                    const updated = await updateInterviewQuestion(id, {
                      question: updatedData.question,
                      sample_response: updatedData.response,
                      order: q.order,
                      job_id: jobId
                    });
                    setQuestions(questions.map(q => q.id === id ? updated : q));
                    toast({
                      title: "Question updated successfully",
                      description: "Your changes have been saved",
                    });
                  } catch (error) {
                    console.error('Error updating question:', error);
                    toast({
                      title: "Error updating question",
                      description: error instanceof Error ? error.message : "An unknown error occurred",
                      variant: "destructive"
                    });
                  }
                }}
                onDelete={async (id) => {
                  try {
                    await deleteInterviewQuestion(id);
                    setQuestions(questions.filter(q => q.id !== id));
                    toast({
                      title: "Question deleted successfully",
                      description: "The question has been removed",
                    });
                  } catch (error) {
                    console.error('Error deleting question:', error);
                    toast({
                      title: "Error deleting question", 
                      description: error instanceof Error ? error.message : "An unknown error occurred",
                      variant: "destructive"
                    });
                  }
                }}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        {!showQuestionCard ? (
          <Button className="bg-primary-dark text-white" onClick={() => setShowQuestionCard(true)}>New Question +</Button>
        ) : (
          <Card className="p-4 bg-purple-50 shadow-long border border-black" fullWidthMobile>
            <div className="flex flex-col space-y-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <p className="text-primary mr-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                    {questions.length + 1}
                  </p>
                  <Textarea
                    placeholder="Enter interview question" 
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="text-lg font-semibold min-h-[50px] min-w-[900px]"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What does a good response look like?"
                  value={responseExample}
                  onChange={(e) => setResponseExample(e.target.value)}
                  className="text-sm text-gray-600"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <div className="flex justify-between w-full">
                    <Button variant="outline" size="sm" onClick={() => setShowQuestionCard(false)}>Cancel</Button>
                    <div className="flex space-x-2">
                      <Button variant="default" size="sm" onClick={handleAddQuestion} disabled={savingQuestion}>
                        {savingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Question'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleGenerateQuestion} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const InterviewCard = ({ 
  id,
  question, 
  response, 
  order,
  onUpdate,
  onDelete 
}: { 
  id: string;
  question: string; 
  response: string; 
  order: number;
  onUpdate: (id: string, data: { question?: string; response?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [editedResponse, setEditedResponse] = useState(response);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(id, {
        question: editedQuestion,
        response: editedResponse
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-4 bg-white shadow-long border border-black" fullWidthMobile>
      <div className="flex flex-col space-y-2">
        {isEditing ? (
          <>
            <Input
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="text-lg font-semibold"
            />
            <Textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              className="text-sm text-gray-600"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <div className="flex space-x-2">
                  <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex flex-row items-center">
                <p className="text-primary mr-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">{order}</p>
                <CardTitle className="text-lg font-semibold">
                  {question}
                </CardTitle>
              </div>
              <div className="flex flex-row items-center">
                <Pencil 
                  className="w-8 h-8 p-2 bg-primary-dark rounded-full p-1 text-white cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                />
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent>
                <p className="text-sm text-gray-600">{response}</p>
              </CardContent>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

export default QuestionSetup;