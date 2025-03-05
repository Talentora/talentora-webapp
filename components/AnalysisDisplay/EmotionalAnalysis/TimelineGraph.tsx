'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/cn";

interface EmotionTimelineProps {
    timeline: any;
    type: 'face' | 'prosody' | 'language';
}

const EmotionTimeline = ({ timeline, type }: EmotionTimelineProps) => {
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [windowSizeFactor, setWindowSizeFactor] = useState(0.1); // Changed default to 0.1
    const [open, setOpen] = useState(false);
    const [allEmotions, setAllEmotions] = useState<string[]>([]);

    const getAllEmotions = () => {
        if (!timeline?.[type] || timeline[type].length === 0) return [];
        const emotions = new Set<string>();
        timeline[type].forEach((frame: any) => {
            if (frame?.emotions) {
                Object.keys(frame.emotions).forEach(emotion => emotions.add(emotion));
            }
        });
        return Array.from(emotions);
    };

    useEffect(() => {
        setAllEmotions(getAllEmotions());
    }, [timeline, type]);

    const getTopEmotions = () => {
        if (!timeline?.[type] || timeline[type].length === 0) return [];
        
        const emotionSums: {[key: string]: number} = {};
        timeline[type].forEach((frame: any) => {
            if (frame?.emotions) {
                Object.entries(frame.emotions).forEach(([emotion, value]) => {
                    emotionSums[emotion] = (emotionSums[emotion] || 0) + (value as number);
                });
            }
        });

        return Object.entries(emotionSums)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([emotion]) => emotion);
    };

    useEffect(() => {
        const topEmotions = getTopEmotions();
        if (topEmotions.length > 0) {
            setSelectedEmotions(topEmotions);
        }
    }, [timeline, type]);

    const formatData = () => {
        if (!timeline?.[type]) return [];
        
        const windowSize = Math.max(1, Math.floor(timeline[type].length * windowSizeFactor));
        
        const rawData = timeline[type].map((frame: any) => ({
            time: frame.time,
            ...selectedEmotions.reduce((acc: any, emotion: string) => {
                acc[emotion] = frame?.emotions?.[emotion] ?? 0;
                return acc;
            }, {})
        }));

        return rawData.map((frame: { time: number; [key: string]: number }, i: number) => {
            const smoothedFrame: { time: number; [key: string]: number } = { time: frame.time };
            
            selectedEmotions.forEach(emotion => {
                const start = Math.max(0, i - Math.floor(windowSize/2));
                const end = Math.min(rawData.length, i + Math.floor(windowSize/2) + 1);
                const window = rawData.slice(start, end);
                const sum = window.reduce((acc: number, f: { [key: string]: number }) => acc + (f[emotion] ?? 0), 0);
                smoothedFrame[emotion] = sum / window.length;
            });

            return smoothedFrame;
        });
    };

    const data = formatData();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FFB6C1', '#98FB98', '#DDA0DD', '#F0E68C', '#87CEEB'];

    const config = selectedEmotions.reduce((acc, emotion, index) => {
        acc[emotion] = { color: colors[index % colors.length] };
        return acc;
    }, {} as any);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                                disabled={!allEmotions.length}
                            >
                                {allEmotions.length > 0 
                                    ? `Select emotions (${selectedEmotions.length})`
                                    : "No emotions available"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search emotions..." />
                                <CommandEmpty>No emotion found.</CommandEmpty>
                                <CommandGroup>
                                    {allEmotions.map((emotion) => (
                                        <CommandItem
                                            key={emotion}
                                            value={emotion}
                                            onSelect={(value) => {
                                                setSelectedEmotions(current => 
                                                    current.includes(value)
                                                        ? current.filter(e => e !== value)
                                                        : [...current, value]
                                                );
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedEmotions.includes(emotion) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {emotion}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                {/* Removed the slider UI for smoothing since we're using fixed value */}
            </div>

            {selectedEmotions.length > 0 && (
                <div className="w-full" style={{ overflow: 'hidden' }}> {/* Added style to remove scrollbar */}
                    <ChartContainer config={config}>
                        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 25 }}>
                            <XAxis 
                                dataKey="time" 
                                label={{ value: 'Time (seconds)', position: 'bottom' }}
                            />
                            <YAxis 
                                label={{ value: 'Intensity', angle: -90, position: 'left' }}
                                domain={[0, 1]}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            {selectedEmotions.map((emotion, index) => (
                                <Line
                                    key={emotion}
                                    type="monotone"
                                    dataKey={emotion}
                                    stroke={colors[index % colors.length]}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))}
                        </LineChart>
                    </ChartContainer>
                </div>
            )}
        </div>
    );
};

const Page = ({ timeline }: { timeline: any }) => {
    return (
        <div className="space-y-8" style={{ overflow: 'hidden' }}> {/* Added style to remove scrollbar */}
            <div>
                <h3 className="text-lg font-medium mb-4">Facial Expressions</h3>
                <EmotionTimeline timeline={timeline} type="face" />
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Voice Analysis</h3>
                <EmotionTimeline timeline={timeline} type="prosody" />
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Language Analysis</h3>
                <EmotionTimeline timeline={timeline} type="language" />
            </div>
        </div>
    );
};

export default Page;