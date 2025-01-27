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

  const { company } = useUser();
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_CARTESIA_API_KEY;
  const tts = apiKey ? useTTS({ apiKey, sampleRate: 44100 }) : null;

  useEffect(() => {
    const fetchVoices = async () => {
      if (!apiKey) {
        console.warn('Cartesia API key not found - voice features disabled');
        return;
      }

      try {
        const cartesia = new Cartesia({ apiKey });
        const voices = await cartesia.voices.list();
        if (voices) {
          const enVoices = voices.filter(voice => voice.language === 'en');
          setVoiceOptions(enVoices);
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };
    
    fetchVoices();
  }, [apiKey]);

  const handleListen = async () => {
    try {
      if (!apiKey || !tts) {
        toast({
          title: 'Voice Features Disabled',
          description: 'Text-to-speech requires a valid API key',
          variant: 'destructive'
        });
        return;
      }

      const voice = newBot.voice as { [key: string]: string };
      await tts.buffer({
        model_id: "sonic-english",
        voice: { mode: "id", id: voice?.id },
        transcript: speakText,
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

  useEffect(() => {
    if (isEdit) {
      setIsOpen(true);
    }
  }, [isEdit]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) onClose();
  };

  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && existingBot) {
        const updatedBot = await updateScout(existingBot.id.toString(), {
          name: newBot.name,
          role: newBot.role,
          description: newBot.description,
          prompt: newBot.prompt,
          company_id: company?.id,
          voice: newBot.voice,
          icon: newBot.icon,
          emotion: newBot.emotion
        });
        onBotUpdated?.(updatedBot);
      } else {
        const createdBot = await createscout({
          name: newBot.name,
          role: newBot.role,
          description: newBot.description,
          prompt: newBot.prompt,
          company_id: company?.id,
          voice: newBot.voice,
          icon: newBot.icon,
          emotion: newBot.emotion
        });
        onBotCreated?.(createdBot);
      }
      
      setIsOpen(false);
      onClose?.();
      
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
        <Button className="w-full" onClick={() => setIsOpen(true)}>
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

export default CreateScout;