'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface EmotionAveragesProps {
    averages: any;
}

const EmotionAverages = ({ averages }: EmotionAveragesProps) => {
    const getTopEmotions = (emotions: Record<string, number>, count: number = 8) => {
        return Object.entries(emotions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, count)
            .map(([emotion, value]) => ({
                emotion,
                value: Number((value * 100).toFixed(1))
            }));
    };

    if (!averages) return null;

    const { face, prosody, language } = averages;
    const analysisTypes = [
        { title: 'Facial Emotions', data: face, color: '#FF6B6B' },
        { title: 'Voice Emotions', data: prosody, color: '#4ECDC4' },
        { title: 'Language Emotions', data: language, color: '#45B7D1' }
    ];

    return (
        <div className="space-y-4 mt-4">
            {analysisTypes.map(({ title, data, color }) => (
                <Card key={title}>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-full md:w-[400px] h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={getTopEmotions(data.emotions)}>
                                        <PolarGrid />
                                        <PolarAngleAxis 
                                            dataKey="emotion"
                                            tick={{ fill: 'currentColor', fontSize: 12 }}
                                        />
                                        <PolarRadiusAxis />
                                        <Radar
                                            name="Emotions"
                                            dataKey="value"
                                            stroke={color}
                                            fill={color}
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="flex-1 px-4">
                                <div className="flex flex-col items-start gap-2 mb-6">
                                    <h3 className="text-xl font-semibold">{title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Overall Score:</span>
                                        <span className="text-3xl font-bold" style={{ color }}>
                                            {data.aggregate_score.toFixed(1)}
                                        </span>
                                        <span className="text-sm text-muted-foreground">/10</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm text-muted-foreground">Top 4 Emotions:</h4>
                                    {getTopEmotions(data.emotions, 4).map(({ emotion, value }) => (
                                        <div key={emotion} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                                            <span className="text-sm font-medium">{emotion}</span>
                                            <span className="text-sm font-bold" style={{ color }}>{value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default EmotionAverages; 