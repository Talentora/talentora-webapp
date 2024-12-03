'use client';
import { useEffect, useState } from 'react';
import { useTTS } from '@cartesia/cartesia-js/react';
import Cartesia, { StreamRequest, Voice } from "@cartesia/cartesia-js";
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
import { createBot, updateBot } from '@/utils/supabase/queries';
import { useCompany } from '@/hooks/useCompany';
import { useToast } from '@/components/Toasts/use-toast';
import { BotDetails } from './BotDetails';
import { VoiceEmotions } from './VoiceEmotions';
import { Label } from '@/components/ui/label';
import { Tables } from '@/types/types_db';

interface CreateBotProps {
  isEdit?: boolean;
  existingBot?: Tables<'bots'>;
  onClose?: () => void;
  onBotCreated?: (bot: Tables<'bots'>) => void;
  onBotUpdated?: (bot: Tables<'bots'>) => void;
}

const CreateBot = ({ 
  isEdit, 
  existingBot, 
  onClose,
  onBotCreated,
  onBotUpdated 
}: CreateBotProps) => {
  const [isOpen, setIsOpen] = useState(isEdit || false);
  const [activeTab, setActiveTab] = useState('bot-details');
  const [speakText, setSpeakText] = useState('Hello, how can I assist you today?');
  const [voiceOptions, setVoiceOptions] = useState<Voice[]>([]);
  const [newBot, setNewBot] = useState({
    name: existingBot?.name || '',
    description: existingBot?.description || '',
    role: existingBot?.role || '',
    icon: existingBot?.icon || 'Bot',
    prompt: existingBot?.prompt || '',
    voice: existingBot?.voice || null,
    emotion: existingBot?.emotion || {
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
  const apiKey = process.env.NEXT_PUBLIC_CARTESIA_API_KEY;

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_CARTESIA_API_KEY is not set');
  }

  const tts = useTTS({
    apiKey: apiKey,
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

  useEffect(() => {
    if (isEdit) {
      setIsOpen(true);
    }
  }, [isEdit]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  console.log("newBot",newBot)

  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && existingBot) {
        const updatedBot = await updateBot(existingBot.id.toString(), {
          name: newBot.name,
          role: newBot.role,
          description: newBot.description,
          prompt: newBot.prompt,
          company_id: company?.id,
          voice: newBot.voice,
          icon: newBot.icon,
          emotion: newBot.emotion
        });
        if (onBotUpdated && updatedBot) {
          onBotUpdated(updatedBot);
        }
      } else {
        const botData = {
          name: newBot.name,
          role: newBot.role,
          description: newBot.description,
          prompt: newBot.prompt,
          company_id: company?.id,
          voice: newBot.voice,
          icon: newBot.icon,
          emotion: newBot.emotion
        };
        
        const createdBot = await createBot(botData);
        if (onBotCreated && createdBot) {
          onBotCreated(createdBot);
        }
      }
      
      setIsOpen(false);
      if (onClose) onClose();
      
      toast({
        title: 'Success',
        description: `Bot ${isEdit ? 'updated' : 'created'} successfully`
      });
    } catch (error) {
      console.error('Failed to save bot:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEdit ? 'update' : 'create'} bot`,
        variant: 'destructive'
      });
    }
  };
  // emotion is a Json object
  // const emotion = newBot.emotion as { [key: string]: number };
  const voice = newBot.voice as { [key: string]: string };

  const handleListen = async () => {
    try {
      // const emotions = {
      //   speed: emotion.speed,
      //   anger: emotion.anger,
      //   curiosity: emotion.curiosity,
      //   positivity: emotion.positivity,
      //   sadness: emotion.sadness,
      //   surprise: emotion.surprise,
      // };
      const response = await tts.buffer({
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: voice?.id // Changed from voiceId to voice?.id
        },
        transcript: speakText,
        // emotions: emotions,
      } as StreamRequest);
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

  if (isEdit) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">Ora</span> Scout</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="bot-details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="bot-details"><span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">Ora</span> Scout Details</TabsTrigger>
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
              <form onSubmit={handleSaveBot} className="space-y-4">
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
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary-dark" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Ora Scout
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Create New <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">Ora</span> Scout</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="bot-details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="bot-details">Ora Scout Details</TabsTrigger>
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
            <form onSubmit={handleSaveBot} className="space-y-4">
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
                <Button type="submit">
                  Create <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">Ora</span> Scout
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBot;