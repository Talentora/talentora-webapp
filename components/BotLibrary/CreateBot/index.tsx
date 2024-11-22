'use client';
import { useEffect, useState } from 'react';
import { useTTS } from '@cartesia/cartesia-js/react';
import Cartesia, { Voice } from "@cartesia/cartesia-js";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { createBot } from '@/utils/supabase/queries';
import { useCompany } from '@/hooks/useCompany';
import { useToast } from '@/components/Toasts/use-toast';
import { BotDetails } from './BotDetails';
import { VoiceEmotions } from './VoiceEmotions';
import { Label } from '@/components/ui/label';

const CreateBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('bot-details');
  const [speakText, setSpeakText] = useState('Hello, how can I assist you today?');
  const [voiceOptions, setVoiceOptions] = useState<Voice[]>([]);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    role: '',
    icon: 'Bot',
    prompt: '',
    voice: null, // Changed from voiceId to voice and set to null
    emotion: {
      speed: 1,
      anger: 1,
      curiosity: 1,
      positivity: 1,
      sadness: 1,
      surprise: 1
    }
  });

  const { company } = useCompany();
  const { toast } = useToast();
  const tts = useTTS({
    apiKey: process.env.NEXT_PUBLIC_CARTESIA_API_KEY,
    sampleRate: 44100,
  });

  useEffect(() => {
    const fetchVoices = async () => {
      const cartesia = new Cartesia({
        apiKey: process.env.NEXT_PUBLIC_CARTESIA_API_KEY,
      });
      const voices = await cartesia.voices.list();
      if (voices) {
        const enVoices = voices.filter(voice => voice.language === 'en');
        console.log("voices",voices);
        console.log("enVoices",enVoices);

        setVoiceOptions(enVoices);
      }
    };
    fetchVoices();
  }, []);

  console.log("newBot",newBot)

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBot({
        name: newBot.name,
        role: newBot.role,
        description: newBot.description,
        prompt: newBot.prompt,
        company_id: company?.id,
        voice: newBot.voice, // Changed from voiceId to voice?.id
        icon: newBot.icon,
        emotion: newBot.emotion
      });
      setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Bot created successfully'
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to create bot:', error);
      toast({
        title: 'Error',
        description: 'Failed to create bot',
        variant: 'destructive'
      });
    }
  };

  const handleListen = async () => {
    try {
      const emotions = {
        speed: newBot.emotions.speed,
        anger: newBot.emotions.anger,
        curiosity: newBot.emotions.curiosity,
        positivity: newBot.emotions.positivity,
        sadness: newBot.emotions.sadness,
        surprise: newBot.emotions.surprise,
      };
      const response = await tts.buffer({
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: newBot.voice?.id // Changed from voiceId to voice?.id
        },
        transcript: speakText,
        emotions: emotions,
      });
      await tts.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to play audio',
        variant: 'destructive'
      });
    }
  };

  return (
    
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary-dark">
          <Plus className="mr-2 h-4 w-4" /> Create New Bot
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Bot Configuration</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="bot-details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="bot-details">Bot Details</TabsTrigger>
            <TabsTrigger value="voice-emotion">Voice and Emotion</TabsTrigger>
            <TabsTrigger value="prompting">Prompting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bot-details">
            <BotDetails
              newBot={newBot}
              setNewBot={setNewBot}
              onNext={() => setActiveTab('voice-emotion')}
            />
          </TabsContent>

          <TabsContent value="voice-emotion">
            <VoiceEmotions
              newBot={newBot}
              setNewBot={setNewBot}
              voiceOptions={voiceOptions}
              speakText={speakText}
              setSpeakText={setSpeakText}
              onListen={handleListen}
              onBack={() => setActiveTab('bot-details')}
              onNext={() => setActiveTab('prompting')}
            />
          </TabsContent>

          <TabsContent value="prompting">
            <form onSubmit={handleCreateBot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Enter Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g. You are an experienced DevOps recruiter..."
                  className="min-h-[150px]"
                  value={newBot.prompt}
                  onChange={(e) => setNewBot({ ...newBot, prompt: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => setActiveTab('voice-emotion')}
                  className="bg-primary-dark text-white"
                >
                  Back
                </Button>
                <Button type="submit">Create Bot</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


export default CreateBot;