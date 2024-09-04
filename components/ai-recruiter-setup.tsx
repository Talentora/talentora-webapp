'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Wand2, Edit, GripVertical } from 'lucide-react'
import { generateQuestion } from '@/app/actions/generateQuestion'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

type QuestionType = 'behavioral' | 'technical' | 'team-based' | 'industry-knowledge'

interface Question {
  id: number
  text: string
  type: QuestionType
  mustAsk: boolean
}

export function AiRecruiterSetup() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "Tell me about a time you faced a challenging problem at work.", type: 'behavioral', mustAsk: false },
    { id: 2, text: "Explain the concept of closures in JavaScript.", type: 'technical', mustAsk: false },
    { id: 3, text: "How do you handle conflicts within a team?", type: 'team-based', mustAsk: false },
  ])
  const [newQuestionText, setNewQuestionText] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('behavioral')
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)

  const handleRemoveQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleAddQuestion = () => {
    if (newQuestionText.trim()) {
      setQuestions([...questions, {
        id: Date.now(),
        text: newQuestionText,
        type: newQuestionType,
        mustAsk: false
      }])
      setNewQuestionText('')
    }
  }

  const handleGenerateQuestion = async () => {
    const generatedQuestion = await generateQuestion(newQuestionType)
    if (generatedQuestion) {
      setQuestions([...questions, {
        id: Date.now(),
        text: generatedQuestion,
        type: newQuestionType,
        mustAsk: false
      }])
    }
  }

  const handleSaveQuestions = () => {
    console.log('Saving questions:', questions)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id)
    setNewQuestionText(question.text)
    setNewQuestionType(question.type)
  }

  const handleUpdateQuestion = () => {
    if (editingQuestionId !== null && newQuestionText.trim()) {
      setQuestions(questions.map(q => 
        q.id === editingQuestionId 
          ? { ...q, text: newQuestionText, type: newQuestionType }
          : q
      ))
      setEditingQuestionId(null)
      setNewQuestionText('')
      setNewQuestionType('behavioral')
    }
  }

  const handleCancelEdit = () => {
    setEditingQuestionId(null)
    setNewQuestionText('')
    setNewQuestionType('behavioral')
  }

  const handleToggleMustAsk = (id: number) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, mustAsk: !q.mustAsk } : q
    ))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newQuestions = Array.from(questions)
    const [reorderedItem] = newQuestions.splice(result.source.index, 1)
    newQuestions.splice(result.destination.index, 0, reorderedItem)

    setQuestions(newQuestions)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Recruiter Setup</h1>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 mb-4">
              {questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                  {(provided) => (
                    <Card 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4"
                    >
                      {editingQuestionId === question.id ? (
                        <div className="flex flex-col space-y-4">
                          <Input
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            placeholder="Enter question text"
                          />
                          <Select value={newQuestionType} onValueChange={(value: QuestionType) => setNewQuestionType(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="behavioral">Behavioral</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="team-based">Team-based</SelectItem>
                              <SelectItem value="industry-knowledge">Industry Knowledge</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex justify-between">
                            <Button onClick={handleUpdateQuestion}>
                              Update Question
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs font-normal">
                                {question.type}
                              </Badge>
                              <p className="text-sm">{question.text}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`must-ask-${question.id}`}
                              checked={question.mustAsk}
                              onCheckedChange={() => handleToggleMustAsk(question.id)}
                            />
                            <label 
                              htmlFor={`must-ask-${question.id}`}
                              className="text-sm text-gray-600"
                            >
                              Must Ask
                            </label>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditQuestion(question)}
                              aria-label="Edit question"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveQuestion(question.id)}
                              aria-label="Remove question"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingQuestionId === null && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <Input
                placeholder="Enter question text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
              <Select value={newQuestionType} onValueChange={(value: QuestionType) => setNewQuestionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="team-based">Team-based</SelectItem>
                  <SelectItem value="industry-knowledge">Industry Knowledge</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button onClick={handleAddQuestion} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" /> Add Question
                </Button>
                <Button onClick={handleGenerateQuestion} className="flex-1">
                  <Wand2 className="mr-2 h-4 w-4" /> Generate with AI
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSaveQuestions} className="w-full">
        Save Questions
      </Button>
    </div>
  )
}