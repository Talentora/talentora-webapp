'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface TeamContextProps {
  onCompletion: (isComplete: boolean) => void;
}

export const TeamContext: React.FC<TeamContextProps> = ({ onCompletion }) => {
  const [teamDescription, setTeamDescription] = useState('');
  const [teamCulture, setTeamCulture] = useState('');
  const [teamGoals, setTeamGoals] = useState('');
  const [teamStructure, setTeamStructure] = useState('');
  const [teamProjects, setTeamProjects] = useState('');
  const [teamDynamics, setTeamDynamics] = useState('');

  const handleChange = () => {
    // Mark as complete if all fields meet minimum length requirement
    const isComplete =
      teamDescription.length >= 100 &&
      teamCulture.length >= 100 &&
      teamGoals.length >= 100 &&
      teamStructure.length >= 100 &&
      teamProjects.length >= 100 &&
      teamDynamics.length >= 100;
    onCompletion(isComplete);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Team Context</h2>
        <p className="text-gray-500">
          Help our AI recruiter understand your team better to effectively
          communicate with candidates.
        </p>
      </div>

      <div className="bg-primary/10 border-2 border-primary p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-primary">Why this matters</h3>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          This information helps our AI recruiter provide candidates with
          accurate and engaging information about your team, creating more
          meaningful conversations and better candidate matches.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team-description">
            Team Description <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="team-description"
            placeholder="Describe your team's role, responsibilities and core activities..."
            value={teamDescription}
            onChange={(e) => {
              setTeamDescription(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${teamDescription.length < 100 && teamDescription.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {teamDescription.length < 100 && teamDescription.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-culture">
            Team Culture and Values <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="team-culture"
            placeholder="Describe your team's culture, values, and what makes it unique..."
            value={teamCulture}
            onChange={(e) => {
              setTeamCulture(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${teamCulture.length < 100 && teamCulture.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {teamCulture.length < 100 && teamCulture.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-structure">
            Team Structure <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="team-structure"
            placeholder="Describe your team's structure, roles, and how work is organized..."
            value={teamStructure}
            onChange={(e) => {
              setTeamStructure(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${teamStructure.length < 100 && teamStructure.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {teamStructure.length < 100 && teamStructure.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-goals">
            Team Goals and Objectives <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="team-goals"
            placeholder="Share your team's current goals and objectives..."
            value={teamGoals}
            onChange={(e) => {
              setTeamGoals(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${teamGoals.length < 100 && teamGoals.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {teamGoals.length < 100 && teamGoals.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-projects">
            Current Projects <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="team-projects"
            placeholder="Describe the main projects your team is working on..."
            value={teamProjects}
            onChange={(e) => {
              setTeamProjects(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${teamProjects.length < 100 && teamProjects.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {teamProjects.length < 100 && teamProjects.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-dynamics">
            Team Dynamics and Work Style <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="team-dynamics"
            placeholder="Describe how your team works together, communication style, and collaboration approaches..."
            value={teamDynamics}
            onChange={(e) => {
              setTeamDynamics(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${teamDynamics.length < 100 && teamDynamics.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {teamDynamics.length < 100 && teamDynamics.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            const teamContext = {
              teamGoals,
              teamProjects,
              teamDynamics,
              teamDescription,
              teamCulture,
              teamStructure
            };
            // TODO: Add API call to save team context
            console.log('Saving team context:', teamContext);

            onCompletion(true);
          }}
          className="bg-primary text-white hover:bg-primary/90"
          disabled={
            !(
              teamDescription.length >= 100 &&
              teamCulture.length >= 100 &&
              teamGoals.length >= 100 &&
              teamStructure.length >= 100 &&
              teamProjects.length >= 100 &&
              teamDynamics.length >= 100
            )
          }
        >
          Save Team Context
        </Button>
      </div>
    </div>
  );
};

export default TeamContext;
