import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, SlidersHorizontal,Mic, Volume2 } from 'lucide-react';
import { Voice } from "@cartesia/cartesia-js";

interface VoiceEmotionsProps {
  newBot: any;
  setNewBot: (bot: any) => void;
  voiceOptions: Voice[];
  speakText: string;
  setSpeakText: (text: string) => void;
  onListen: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function VoiceEmotions({
  newBot,
  setNewBot,
  voiceOptions,
  speakText,
  setSpeakText,
  onListen,
  onBack,
  onNext
}: VoiceEmotionsProps) {

    console.log("emotions",newBot.emotions)

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="voice">Voice</Label>
        <Select
          value={newBot.voice?.id}
          onValueChange={(value) => setNewBot({ ...newBot, voice: voiceOptions.find(voice => voice.id === value) })}
        >
          <SelectTrigger className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voiceOptions.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="speakText">Speak Text</Label>
        <Textarea
          id="speakText"
          placeholder="e.g Hello, how can I assist you today?"
          value={speakText}
          onChange={(e) => setSpeakText(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-between gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Speed/Mix
              {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <EmotionSliders newBot={newBot} setNewBot={setNewBot} />
          </DialogContent>
        </Dialog>

        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 bg-primary-dark text-white"
          onClick={onListen}
        >
          <Volume2 className="h-4 w-4" />
          Speak
        </Button>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onBack}
          className="bg-primary-dark text-white"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="bg-primary-dark text-white"
        >
          Next
        </Button>
      </div>
    </form>
  );
}



function EmotionSliders({ newBot, setNewBot }: { newBot: any; setNewBot: (bot: any) => void }) {
  const emotions = ['speed', 'anger', 'curiosity', 'positivity', 'sadness', 'surprise'];
  return (
    <div className="flex flex-col gap-4">
    <h1 className="text-lg font-bold">Emotion Settings</h1>
      {emotions.map((emotion) => (
        <div key={emotion} className="gap-5 flex flex-col justify-between">
          <Label htmlFor={emotion}>
            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </Label>
          <Slider
            id={emotion}
            min={1}
            max={5}
            value={newBot.emotions?.emotion} // Changed to handle undefined values
            onValueChange={(value) =>
              setNewBot({
                ...newBot,
                emotion: {
                  ...newBot.emotion,
                  [emotion]: value[0]
                }
              })
            }
            className={'bg-gray-200' }
          />
        </div>
      ))}
    </div>
  );
} 