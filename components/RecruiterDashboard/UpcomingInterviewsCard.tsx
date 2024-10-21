import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UpcomingInterviewsCard() {
  return (
    <Card className="p-5 border border-gray-400 rounded-lg shadow-sm bg-primary-background">
      <CardHeader>
        <CardTitle>Upcoming AI Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          You have 12 upcoming AI interviews scheduled this week.
        </div>
        <Button className="mt-4 w-full border border-gray-400 text-black hover:bg-white hover:border-gray-500 hover:text-black" variant="outline">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}