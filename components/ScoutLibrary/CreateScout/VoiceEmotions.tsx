import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Volume2 } from 'lucide-react';
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
  const isVoiceSelected = !!newBot.voice?.id;

  // Find the selected voice from voiceOptions if it exists
  const selectedVoice = newBot.voice?.id 
    ? voiceOptions.find(voice => voice.id === newBot.voice.id)
    : null;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="voice" className="text-sm font-medium">Voice Selection</Label>
          <Select
            value={selectedVoice?.id}
            onValueChange={(value) => {
              const voice = voiceOptions.find(voice => voice.id === value);
              setNewBot({ ...newBot, voice: voice || null });
            }}
          >
            <SelectTrigger className="mt-1.5">
              <Mic className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select a voice">
                {selectedVoice?.name}
              </SelectValue>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="speakText" className="text-sm font-medium">Sample Text</Label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <Textarea
            id="speakText"
            placeholder="e.g Hello, how can I assist you today?"
            value={speakText}
            onChange={(e) => setSpeakText(e.target.value)}
            className="text-sm"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={onListen}
          disabled={!isVoiceSelected}
        >
          <Volume2 className="h-4 w-4" />
          Test Voice
        </Button>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!isVoiceSelected}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 