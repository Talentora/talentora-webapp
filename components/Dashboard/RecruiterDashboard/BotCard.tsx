import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquareIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const BotCard = () => {
  return (
    <div>
    <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-[#5650F0]/50 bg-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customize your Ora Scouts</CardTitle>
        <Link href="/bot">
        <MessageSquareIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
    </CardHeader>
    <CardContent>
        <p className="text-sm mb-4">
        AI-powered assistant for recruiting tasks
        </p>
        <Button className="w-full" variant="outline">
        Chat with Bot
        </Button>
            </CardContent>
        </Card>
    </div>
  );
};

export default BotCard;
