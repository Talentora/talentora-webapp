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
        const updatedBot = await updateBot(existingBot.id, {
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

  const handleListen = async () => {
    try {
      const emotions = {
        speed: newBot.emotion.speed,
        anger: newBot.emotion.anger,
        curiosity: newBot.emotion.curiosity,
        positivity: newBot.emotion.positivity,
        sadness: newBot.emotion.sadness,
        surprise: newBot.emotion.surprise,
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

  if (isEdit) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Bot</DialogTitle>
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
          <Plus className="mr-2 h-4 w-4" /> Create New Bot
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Create New Bot</DialogTitle>
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
                  Create Bot
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