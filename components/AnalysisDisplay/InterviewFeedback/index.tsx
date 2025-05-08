import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Quote } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea, Cell, LabelList, ComposedChart, Scatter, Line } from 'recharts';
import { 
  InterviewFeedback,
  type TechnicalFeedback,
  type CommunicationFeedback,
  type ExperienceFeedback,
  type BehavioralFeedback,
} from './interview-feedback';
import { ChartContainer } from '@/components/ui/chart';

interface ScoreCardProps {
  title: string;
  score: number;
  color: string;
}

const ScoreCard = ({ title, score, color }: ScoreCardProps) => (
  <Card className="p-4 flex flex-col items-center justify-center">
    <div className="text-sm font-medium mb-2">{title}</div>
    <div className={`text-3xl font-bold ${color}`}>{score.toFixed(1)}</div>
    <div className={`w-full mt-2 ${color.replace('text-', 'bg-')} bg-opacity-20 rounded-full h-2`}>
      <div 
        className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        style={{ width: `${score * 10}%` }}
      />
    </div>
  </Card>
);

interface SectionProps {
  data: TechnicalFeedback | CommunicationFeedback | ExperienceFeedback | BehavioralFeedback;
  color: string;
}

const Section = ({ data, color }: SectionProps) => {
  const [expandedQuotes, setExpandedQuotes] = useState<string[]>([]);

  const toggleQuotes = (key: string) => {
    setExpandedQuotes(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  // Get all score sections to display in the summary table
  const getScoreSections = () => {
    return Object.entries(data).filter(([key, value]) => {
      return typeof value === 'object' && value !== null && 'score' in value && key !== 'overall_score';
    });
  };

  // Generate random average scores for comparison
  const generateRandomAverages = () => {
    const sections = getScoreSections();
    const averages: Record<string, number> = {};
    
    sections.forEach(([key]) => {
      // Generate a random average between 5.5 and 8.5
      averages[key] = 5.5 + Math.random() * 3;
    });
    
    return averages;
  };

  const randomAverages = generateRandomAverages();

  const renderScoreSummaryTable = () => {
    const scoreSections = getScoreSections();
    
    // Calculate average of all random averages for the overall average
    const overallAverage = Object.values(randomAverages).reduce((sum, val) => sum + val, 0) / 
                          Object.values(randomAverages).length;
    
    // Create chart data including subscores and overall score
    const chartData = [
      ...getScoreSections().map(([key, content]: [string, any]) => {
        const avgScore = randomAverages[key];
        const distance = content.score - avgScore;
        
        return {
          name: key.replace(/_/g, ' '),
          score: content.score,
          average: avgScore,
          distance: distance,
          isPositive: distance > 0,
          isOverall: false
        };
      }),
      // Add overall score as the last item
      {
        name: 'OVERALL',
        score: data.overall_score,
        average: overallAverage,
        distance: data.overall_score - overallAverage,
        isPositive: data.overall_score > overallAverage,
        isOverall: true
      }
    ];
    
    return (
      <div className="mb-8">
        <ChartContainer
          config={{
            score: { color: color.replace('text-', '') },
            average: { color: 'gray' }
          }}
          className="h-[450px] w-full"
        >
          <ComposedChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 10]} 
              ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={({ y, payload }) => {
                const isOverall = payload.value === 'OVERALL';
                return (
                  <text 
                    x={0} 
                    y={y} 
                    dy={4} 
                    textAnchor="start" 
                    fill={isOverall ? color : "#666"}
                    fontWeight={isOverall ? "bold" : "normal"}
                    fontSize={isOverall ? 14 : 12}
                  >
                    {isOverall 
                      ? payload.value 
                      : payload.value.charAt(0).toUpperCase() + payload.value.slice(1)}
                  </text>
                );
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className={`font-medium capitalize ${data.isOverall ? 'text-lg' : ''}`}>
                        {data.name}
                      </p>
                      <p className="text-sm">Score: <span className="font-medium">{data.score.toFixed(1)}</span></p>
                      <p className="text-sm">Avg among applicants: <span className="font-medium">{data.average.toFixed(1)}</span></p>
                      <p className={`text-sm ${data.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        Compared to avg: <span className="font-medium">{data.isPositive ? '+' : ''}{data.distance.toFixed(1)}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              dataKey="score" 
              fill={`var(--color-score)`} 
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                const isOverall = payload.isOverall;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isOverall ? 10 : 8} 
                    fill={`var(--color-score)`} 
                    stroke="#fff"
                    strokeWidth={isOverall ? 3 : 2}
                  />
                );
              }}
            >
              <LabelList 
                dataKey="score" 
                position="right" 
                formatter={(value: number, entry: any) => {
                  if (!entry || !entry.payload) return value.toFixed(1);
                  return entry.payload.isOverall 
                    ? `${value.toFixed(1)} (Overall)` 
                    : value.toFixed(1);
                }}
                style={{
                  fontWeight: 'normal',
                  fontSize: 12
                }}
              />
            </Scatter>
            <Scatter 
              dataKey="average" 
              fill="#888" 
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                const isOverall = payload.isOverall;
                return (
                  <g transform={`translate(${cx},${cy})`}>
                    <line x1="-6" y1="-6" x2="6" y2="6" stroke={isOverall ? "#555" : "#888"} strokeWidth={isOverall ? 3 : 2} />
                    <line x1="6" y1="-6" x2="-6" y2="6" stroke={isOverall ? "#555" : "#888"} strokeWidth={isOverall ? 3 : 2} />
                  </g>
                );
              }}
            >
              <LabelList 
                dataKey="average" 
                position="top" 
                formatter={(value: number, entry: any) => {
                  if (!entry || !entry.payload) return `Avg: ${value.toFixed(1)}`;
                  return entry.payload.isOverall 
                    ? `Overall Avg: ${value.toFixed(1)}` 
                    : `Avg: ${value.toFixed(1)}`;
                }}
                style={{
                  fontSize: 10,
                  fill: '#888',
                  fontWeight: 'normal'
                }}
              />
            </Scatter>
          
          </ComposedChart>
        </ChartContainer>
        
       
      </div>
    );
  };

  const renderSubsection = (key: string, content: any) => {
    // Skip overall score and hiring recommendation
    if (key === 'overall_score' || key === 'hiring_recommendation') return null;
    
    // Handle array content (like key_strengths, areas_for_improvement)
    if (Array.isArray(content)) {
      return (
        <div key={key} className="mb-6">
          <h4 className="font-medium mb-3 capitalize text-lg">
            {key.replace(/_/g, ' ')}
          </h4>
          
          <ul className="list-disc list-inside space-y-2 pl-2">
            {content.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Handle score sections (knowledge_depth, problem_solving, etc)
    if (typeof content === 'object' && content !== null) {
      // Get the random average for this subscore
      const avgScore = randomAverages[key] || 7.0;
      const comparison = content.score > avgScore ? 
        `Above average by ${(content.score - avgScore).toFixed(1)}` : 
        `Below average by ${(avgScore - content.score).toFixed(1)}`;
      
      return (
        <div key={key} className="mb-8 last:mb-0">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-medium capitalize text-lg">
              {key.replace(/_/g, ' ')}
            </h4>
            
            <Badge variant="outline" className={color}>
              {content.score.toFixed(1)}
            </Badge>
            
           
          </div>
          
          <p className="text-md text-muted-foreground mb-4 leading-relaxed">
            {content.explanation}
          </p>
          
          <div className="relative mt-2">
            <button
              onClick={() => toggleQuotes(key)}
              className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground py-1"
            >
              <Quote className="h-3 w-3" />
              {expandedQuotes.includes(key) ? 'Hide' : 'Show'} supporting quotes
              <ChevronRight 
                className={`h-3 w-3 transition-transform ${
                  expandedQuotes.includes(key) ? 'rotate-90' : ''
                }`}
              />
            </button>
            
            {expandedQuotes.includes(key) && (
              <div className="mt-3 space-y-3 pl-2">
                {content.supporting_quotes.map((quote: string, i: number) => (
                  <div 
                    key={i} 
                    className="text-xs text-muted-foreground border-l-2 pl-3 py-1 leading-relaxed"
                  >
                    {quote}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      {renderScoreSummaryTable()}
      {Object.entries(data).map(([key, content]) => renderSubsection(key, content))}
    </div>
  );
};

interface InterviewFeedbackProps {
  feedback: InterviewFeedback;
}

export function InterviewFeedbackComponent({ feedback }: InterviewFeedbackProps) {
  const sections = [
    { title: 'Technical', data: feedback.technical, color: 'text-blue-500' },
    { title: 'Communication', data: feedback.communication, color: 'text-green-500' },
    { title: 'Experience', data: feedback.experience, color: 'text-purple-500' },
    { title: 'Behavioral', data: feedback.behavioral, color: 'text-orange-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
  
      <Tabs defaultValue={sections[0].title.toLowerCase()} className="w-full">
        {/* tab headers */}
        <TabsList className="w-full justify-start mb-4 bg-muted/50 p-2">
          {sections.map(({ title, data, color }) => (
            <div key={title} className="flex items-center gap-2">
            <TabsTrigger
              key={title}
              value={title.toLowerCase()}
              className="flex items-center gap-2 text-lg py-3 px-4"
            >
              {title}
              <Badge variant="outline" className={`${color} text-base px-2 py-1`}>
                {data.overall_score.toFixed(1)}
              </Badge>
            </TabsTrigger>
            </div>
          ))}
        </TabsList>

        {/* tab content */}
        {sections.map(({ title, data, color }) => (
          <TabsContent key={title} value={title.toLowerCase()}>
            <Card className="p-6">
              <Section data={data} color={color} />
            
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 