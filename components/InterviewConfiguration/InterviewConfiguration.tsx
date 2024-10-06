'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic } from 'lucide-react';
// import Configuration from '@/components/Configuration';
import { AiRecruiterSetup } from '../ai-recruiter-setup';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>;

interface InterviewConfigurationProps {
  job: Job;
}

const InterviewConfiguration: React.FC<InterviewConfigurationProps> = ({
  job
}) => {
  const router = useRouter();
  const [config, setConfig] = useState({
    recruiterName: '',
    departmentName: '',
    interviewDuration: 30,
    interviewerName: 'Alex',
    interviewerVoice: '',
    questionCount: 5,
    questionTypes: [],
    department: '',
    departmentContext: ''
  });
  const [listenerInput, setListenerInput] = useState('');
  const [customQuestions, setCustomQuestions] = useState(['']);

  const handleChange = (field: string, value: string | number | string[]) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('Submitted config:', config);
  };

  // const handleSpeak = () => {
  //   if ('speechSynthesis' in window) {
  //     const utterance = new SpeechSynthesisUtterance(
  //       listenerInput || "Hello, I'm your RoboRecruiter!"
  //     );
  //     speechSynthesis.speak(utterance);
  //   } else {
  //     alert('Speech synthesis is not supported in your browser.');
  //   }
  // };

  const handleCustomQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...customQuestions];
    updatedQuestions[index] = value;
    setCustomQuestions(updatedQuestions);
  };

  const addCustomQuestion = () => {
    setCustomQuestions([...customQuestions, '']);
  };

  const generateAIQuestions = () => {
    // This is a placeholder. In a real application, you would call an AI service here.
    const aiGeneratedQuestions = [
      'What challenges have you faced in your previous roles?',
      'How do you approach problem-solving in a team environment?',
      'Can you describe a situation where you had to adapt to a significant change?'
    ];
    setCustomQuestions([...customQuestions, ...aiGeneratedQuestions]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto p-4 space-y-6"
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        Bot Configuration
      </h1>

      {/* Department Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
          <CardDescription>
            Specify your company, department, and provide any additional
            context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={config.department}
              onChange={(e) => handleChange('department', e.target.value)}
              placeholder="e.g. Engineering, Marketing, HR"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentContext">Department</Label>
            <Input
              id="department"
              value={config.departmentContext}
              onChange={(e) =>
                handleChange('departmentContext', e.target.value)
              }
              placeholder="e.g. Our team focuses on building a robust and scalable backend"
            />
          </div>
        </CardContent>
      </Card>

      {/* Combined Interview Settings Card */}

      {/* Interviewer Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interviewer Settings</CardTitle>
          <CardDescription>
            Configure the AI interviewer&apos;s name and voice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interviewerName">Interviewer Name</Label>
            <Input
              id="interviewerName"
              value={config.interviewerName}
              onChange={(e) => handleChange('interviewerName', e.target.value)}
              placeholder="e.g. Alex"
              className="text-primary-900"
            />
          </div>
          <div className="space-y-2">
            {/* <Configuration showAllOptions={true} /> */}
          </div>
        </CardContent>
      </Card>

      {/* Listen to Your Interviewer Card */}
      <Card>
        <CardHeader>
          <CardTitle>Listen to Your Interviewer</CardTitle>
          <CardDescription>
            Test how your AI interviewer sounds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="listenerInput">
              Enter text for the AI to speak
            </Label>
            <div className="flex space-x-2">
              <Input
                id="listenerInput"
                value={listenerInput}
                onChange={(e) => setListenerInput(e.target.value)}
                placeholder={`Hi, I&apos;m ${config.interviewerName}. Welcome to the interview.`}
                className="text-primary-900"
              />
              <Button type="button" onClick={() => {}}>
                <Mic className="mr-2 h-4 w-4" /> Speak
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AiRecruiterSetup />

      {/* Enter Sample Interview Button */}
      <Button
        type="button"
        className="w-full"
        onClick={() => router.push(`/bot?jobId=${job.id}`)}
      >
        Enter Sample Interview
      </Button>

      <Button type="submit" className="w-full">
        Save Configuration
      </Button>
    </form>
  );
};

export default InterviewConfiguration;
