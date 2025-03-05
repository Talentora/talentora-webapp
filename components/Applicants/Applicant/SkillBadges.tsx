import { Badge } from '@/components/ui/badge';
import { Code, Trophy, Shield } from 'lucide-react';
import React from 'react';

interface SkillBadge {
  id: string;
  name: string;
  icon: React.ReactNode;
  confidenceScore: number; // 0-100
}

// Sample data - simplified badges
const SAMPLE_BADGES: SkillBadge[] = [
  {
    id: '1',
    name: 'React',
    icon: <Code className="h-4 w-4" />,
    confidenceScore: 96
  },
  {
    id: '2',
    name: 'Problem Solving',
    icon: <Trophy className="h-4 w-4" />,
    confidenceScore: 92
  },
  {
    id: '3',
    name: 'Leadership',
    icon: <Shield className="h-4 w-4" />,
    confidenceScore: 78
  }
];

interface SkillBadgesProps {
  candidateId?: string; // Optional - would be used to fetch real data
}

export default function SkillBadges({ candidateId }: SkillBadgesProps) {
  // In a real application, you would fetch the actual badges based on candidateId
  const badges = SAMPLE_BADGES;
  
  // Get color based on confidence score
  const getIconColor = (score: number) => {
    if (score >= 95) return 'text-blue-500';
    if (score >= 85) return 'text-yellow-500';
    if (score >= 75) return 'text-gray-400';
    return 'text-amber-700';
  };

  return (
    <div className="bg-background rounded-lg p-4 border shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Key Skills</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {badges.map(badge => {
          const iconColor = getIconColor(badge.confidenceScore);
          return (
            <Badge 
              key={badge.id}
              className="bg-background text-foreground flex items-center gap-2 px-3 py-1 border"
            >
              <div className={`${iconColor} text-lg`}>
                {React.cloneElement(badge.icon as React.ReactElement, { className: 'h-6 w-6' })}
              </div>
              <span>{badge.name}</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 