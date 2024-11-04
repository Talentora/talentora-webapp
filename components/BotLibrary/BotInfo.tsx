import { Button } from '@/components/ui/button';
import { Tables } from '@/types/types_db';
type Bot = Tables<'bots'>;

interface BotInfoProps {
  bot: Bot;
  };


export const BotInfo: React.FC<BotInfoProps> = ({ bot }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {/* {bot.icon} */}
        <span className="text-lg font-semibold">{bot.name}</span>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">About this Bot</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {bot.description}
          </p>
        </div>
        <div className="flex justify-end">
          <Button>Join a sample call and meet your interviewer</Button>
        </div>
      </div>
    </div>
  );
};

