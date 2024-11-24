'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareIcon, UserIcon, UsersIcon } from 'lucide-react';
import { Job, ApplicantCandidate } from '@/types/merge';
import { Loader2 } from 'lucide-react';

import ActiveJobsCard from './ActiveJobsCard';
import RecentApplicantsCard from './RecentApplicantsCard';
import SettingsCard from './SettingsCard';
import ApplicantCountCard from './FactCards/ApplicantCount';
import CompletedAssessmentsCard from './FactCards/CompletedAssessments';
import BotCard from './BotCard';

export default function RecruiterDashboard() {


  return (
    <div className="flex w-full">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Recruiting Dashboard</h1>

        

        <div className="grid grid-cols-2 gap-6 ">
          {/* fact 1  */}
          <ApplicantCountCard  />


          {/* fact 2 */}
          <CompletedAssessmentsCard />

          <ActiveJobsCard />

          <RecentApplicantsCard />

          {/* bot */}
          <BotCard />
         

          <SettingsCard />
        </div>
      </main>
    </div>
  );
}
