'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

const Page = ({ timeline }: { timeline: any }) => {
    // Get the top 5 most prevalent emotions based on average value
    const getTopEmotions = () => {
        if (!timeline?.face || timeline.face.length === 0) return [];
        
        const emotionSums: {[key: string]: number} = {};
        timeline.face.forEach((frame: any) => {
            Object.entries(frame.emotions).forEach(([emotion, value]) => {
                emotionSums[emotion] = (emotionSums[emotion] || 0) + (value as number);
            });
        });

        return Object.entries(emotionSums)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([emotion]) => emotion);
    };

    const formatData = () => {
        if (!timeline?.face) return [];
        
        const topEmotions = getTopEmotions();
        return timeline.face.map((frame: any) => ({
            time: frame.time,
            ...topEmotions.reduce((acc: any, emotion: string) => {
                acc[emotion] = frame.emotions[emotion];
                return acc;
            }, {})
        }));
    };

    const data = formatData();
    const topEmotions = getTopEmotions();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

    const config = topEmotions.reduce((acc, emotion, index) => {
        acc[emotion] = { color: colors[index] };
        return acc;
    }, {} as any);

    return (
        <div className="w-full h-[400px]">
            <ChartContainer config={config}>
                <LineChart data={data}>
                    <XAxis 
                        dataKey="time" 
                        label={{ value: 'Time (seconds)', position: 'bottom' }}
                    />
                    <YAxis 
                        label={{ value: 'Intensity', angle: -90, position: 'left' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {topEmotions.map((emotion, index) => (
                        <Line
                            key={emotion}
                            type="monotone"
                            dataKey={emotion}
                            stroke={colors[index]}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ChartContainer>
        </div>
    );
};

export default Page;