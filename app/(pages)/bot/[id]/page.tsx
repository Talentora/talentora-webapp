"use client";
import {BotInfo} from '@/components/BotLibrary/BotInfo';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/types/types_db';
type Bot = Tables<'bots'>;
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getBotById } from '@/utils/supabase/queries';



export default function BotPage({ params }: { params: { id: string } }) {
    const [bot, setBot] = useState<Bot | null>(null);
    const [error, setError] = useState<string | null>(null);
    const botId = parseInt(params.id);

    useEffect(() => {
        async function fetchBot() {
            try {
                const botData = await getBotById(botId.toString());
                if (!botData) {
                    setError('Bot not found');
                    return;
                }
                setBot(botData);
            } catch (err) {
                setError(`Failed to fetch bot, ${err}`);
                console.error(err);
            }
        }
        
        if (botId) {
            fetchBot();
        }
    }, [botId]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!bot) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    }

    return <BotInfo bot={bot} />;
}