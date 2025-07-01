import TeamGrid from '@/components/Team/TeamGrid';
import { getRecruiters } from '@/utils/supabase/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team | Talentora',
  description:
    'Meet the passionate team behind Talentora - leaders in AI-powered recruitment solutions.'
};

export default async function TeamPage() {
  const recruiters = await getRecruiters();

  return (
    <main className="min-h-screen">
      <TeamGrid recruiters={recruiters} />
    </main>
  );
}
