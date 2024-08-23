import { DegreeTypes } from './DegreeTypes';
import { ApplicationsGraph } from './ApplicationsGraph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const page = () => {
  const [visible, setVisible] = useState(true);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Applicant Statistics</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setVisible(!visible)}>
            {visible ? 'Hide' : 'Show'} Statistics
          </Button>
        </div>
      </CardHeader>
      {visible && (
        <div >
          {/* add statistic components here*/}
          <CardContent className="flex flex-row justify-between">
            <DegreeTypes />
            <ApplicationsGraph />
          </CardContent>
        </div>
      )}
    </Card>
  );
}

export default page;