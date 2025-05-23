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
import { createscout, updateScout } from '@/utils/supabase/queries';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/components/Toasts/use-toast';
import { BotDetails } from '@/components/ScoutLibrary/CreateScout/ScoutDetails';
import { VoiceEmotions } from '@/components/ScoutLibrary/CreateScout/VoiceEmotions';
import { Label } from '@/components/ui/label';
import { Tables } from '@/types/types_db';

interface CreateBotProps {
  isEdit?: boolean;
  existingBot?: Tables<'bots'>;
  onClose?: () => void;
  onBotCreated?: (bot: Tables<'bots'>) => void;
  onBotUpdated?: (bot: Tables<'bots'>) => void;
}

const CreateScout = ({ 
  isEdit, 
  existingBot, 
  onClose,
  onBotCreated,
  onBotUpdated 
}: CreateBotProps) => {
  const [isOpen, setIsOpen] = useState(!!isEdit);
  const [activeTab, setActiveTab] = useState('bot-details');
  const [speakText, setSpeakText] = useState('Hello, how can I assist you today?');
  const [voiceOptions, setVoiceOptions] = useState<Voice[]>([]);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    role: '',
    icon: 'Bot',
    prompt: '',
    voice: null as Voice | null,
    emotion: {
      speed: 1,
      anger: 1,
      curiosity: 1,
      positivity: 1,
      sadness: 1,
      surprise: 1
    }
  });

  const { company } = useUser();
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
    setIsOpen(!!isEdit);
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && existingBot) {
      setNewBot({
        name: existingBot.name || '',
        description: existingBot.description || '',
        role: existingBot.role || '',
        icon: existingBot.icon || 'Bot',
        prompt: existingBot.prompt || '',
        voice: existingBot.voice as Voice | null,
        emotion: existingBot.emotion as {
          speed: number;
          anger: number;
          curiosity: number;
          positivity: number;
          sadness: number;
          surprise: number;
        } || {
          speed: 1,
          anger: 1,
          curiosity: 1,
          positivity: 1,
          sadness: 1,
          surprise: 1
        }
      });
      setSpeakText('Hello, how can I assist you today?');
    }
  }, [isEdit, existingBot]);

  useEffect(() => {
    if (!isEdit && isOpen) {
      setNewBot({
        name: '',
        description: '',
        role: '',
        icon: 'Bot',
        prompt: '',
        voice: null as Voice | null,
        emotion: {
          speed: 1,
          anger: 1,
          curiosity: 1,
          positivity: 1,
          sadness: 1,
          surprise: 1
        }
      });
      setActiveTab('bot-details');
      setSpeakText('Hello, how can I assist you today?');
    }
  }, [isOpen, isEdit]);

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
        const updatedBot = await updateScout(existingBot.id.toString(), {
          name: newBot.name,
          role: newBot.role,
          description: newBot.description,
          prompt: newBot.prompt,
          company_id: company?.data?.id,
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
          company_id: company?.data?.id,
          voice: newBot.voice,
          icon: newBot.icon,
          emotion: newBot.emotion
        };
        
        const createdBot = await createscout(botData);
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
          id: newBot.voice?.id
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

  const validateStep = (step: string) => {
    switch (step) {
      case 'bot-details':
        return newBot.name && newBot.description && newBot.role;
      case 'voice-emotion':
        return typeof newBot.voice === 'object' && newBot.voice !== null && 'id' in newBot.voice;
      case 'prompting':
        return !!newBot.prompt;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(activeTab)) {
      toast({
        title: 'Required Fields',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive'
      });
      return;
    }

    switch (activeTab) {
      case 'bot-details':
        setActiveTab('voice-emotion');
        break;
      case 'voice-emotion':
        setActiveTab('prompting');
        break;
    }
  };

  const handleBack = () => {
    switch (activeTab) {
      case 'voice-emotion':
        setActiveTab('bot-details');
        break;
      case 'prompting':
        setActiveTab('voice-emotion');
        break;
    }
  };

  const renderDialogContent = () => (
    <DialogContent className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {isEdit ? 'Edit' : 'Create New'} <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text ">Ora</span> Scout
        </DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="bot-details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bot-details" disabled>
            <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">Ora</span> Scout Details
          </TabsTrigger>
          <TabsTrigger value="voice-emotion" disabled>Voice and Emotion</TabsTrigger>
          <TabsTrigger value="prompting" disabled>Prompting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bot-details">
          <BotDetails
            newBot={newBot}
            setNewBot={setNewBot}
            onNext={handleNext}
          />
        </TabsContent>
        <TabsContent value="voice-emotion">
          <VoiceEmotions
            newBot={newBot}
            setNewBot={setNewBot}
            voiceOptions={voiceOptions}
            onNext={handleNext}
            onBack={handleBack}
            onListen={handleListen}
            speakText={speakText}
            setSpeakText={setSpeakText}
          />
        </TabsContent>
        <TabsContent value="prompting">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter the prompt for your Ora Scout..."
                value={newBot.prompt}
                onChange={(e) => setNewBot({ ...newBot, prompt: e.target.value })}
                className="min-h-[200px]"
                required
              />
            </div>
            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSaveBot}
              >
                {isEdit ? 'Save Changes' : 'Create Scout'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button className="from-primary-dark to-pink-500 text-white hover:from-primary-dark/90 hover:to-pink-500/90">
            <Plus className="mr-2 h-4 w-4" />
            Create New Scout
          </Button>
        </DialogTrigger>
      )}
      {renderDialogContent()}
    </Dialog>
  );
};

export default CreateScout;