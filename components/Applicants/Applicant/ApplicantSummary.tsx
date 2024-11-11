import { ApplicantCandidate } from '@/types/merge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LineChart from '@/components/ui/line-chart';
import RadarChart from '@/components/ui/radar-chart';
import HistogramChart from '@/components/ui/histogram';
interface ApplicantSummaryProps {
  ApplicantCandidate: ApplicantCandidate;
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function ApplicantSummary({
  ApplicantCandidate
}: ApplicantSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* summary */}
      <Card className="flex-1 border border-gray-200 p-4 col-span-2">
      <CardHeader>
        <CardTitle>Candidate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h1 className="text-lg font-bold">AI Summary</h1>
          <ul className="list-disc pl-5">
            <li>Strong communication skills demonstrated through clear and concise responses.</li>
            <li>Highlighted experience in team projects, showcasing ability to work collaboratively.</li>
            <li>Problem-solving skills were evident in the candidate's approach to hypothetical scenarios.</li>
          </ul>
        </div>
        </CardContent>
      </Card>
        {/* radar chart */}
        <Card className="flex-1 border border-gray-200 p-4">
        <CardHeader>
            <CardTitle>Radar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart labels={['Role Fit', 'Culture Fit', 'Behavioral Score', 'Resume Score']} datasets={[{ label: 'Skills', data: [80, 90, 70, 40], backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }]} />
          </CardContent>
        </Card>

        {/* line chart */}
        <Card className="flex-1 border border-gray-200 p-4">
          <CardHeader>
            <CardTitle>Emotional Analysis Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              labels={['0s', '10s', '20s', '30s', '40s', '50s', '60s', '70s', '80s', '90s', '100s', '110s', '120s', '130s', '140s', '150s', '160s', '170s', '180s', '190s', '200s']} 
              datasets={[
                {
                  label: 'Happiness',
                  data: [80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110, 112, 115, 118, 120, 122, 125, 128, 130],
                  borderColor: 'rgb(75, 192, 192)', // Teal
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
                {
                  label: 'Sadness',
                  data: [20, 18, 15, 10, 8, 5, 3, 2, 1, 0, 2, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28],
                  borderColor: 'rgb(54, 162, 235)', // Blue
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                },
                {
                  label: 'Anger',
                  data: [10, 12, 8, 15, 5, 10, 12, 8, 15, 5, 10, 12, 8, 15, 5, 10, 12, 8, 15, 5, 10],
                  borderColor: 'rgb(255, 99, 132)', // Red
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                  label: 'Surprise',
                  data: [30, 45, 35, 40, 38, 42, 45, 48, 50, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80],
                  borderColor: 'rgb(255, 206, 86)', // Yellow
                  backgroundColor: 'rgba(255, 206, 86, 0.2)',
                },
                {
                  label: 'Fear',
                  data: [15, 20, 12, 18, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50],
                  borderColor: 'rgb(153, 102, 255)', // Purple
                  backgroundColor: 'rgba(153, 102, 255, 0.2)',
                }
              ]} 
              options={{
                scales: {
                  x: {
                    display: false,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="flex-1 border border-gray-200 p-4">
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-2">85%</h2>
                <p className="text-center mt-2">Based on emotional analysis and other factors, this candidate has an overall score of 85%, falling into the <span className="font-bold text-green-500">Great</span> category.</p>
                <div className="stoplight">
                  <div className="light red bg-red-500"></div>
                  <div className="light yellow bg-yellow-500"></div>
                  <div className="light green bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="flex-1 border border-gray-200 p-4">
        <CardHeader>
          <CardTitle>Candidate Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <HistogramChart
            labels={Array.from({length: 21}, (_, i) => (i * 5).toString())}
            datasets={[
              {
                label: 'Number of Candidates',
                data: Array.from({length: 21}, (_, i) => {
                  const mean = 65;
                  const stdev = 10;
                  const normalDistribution = (x: number) => {
                    return (1 / (stdev * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * stdev ** 2));
                  };
                  let sum = 0;
                  for (let j = i * 5; j < (i + 1) * 5; j++) {
                    sum += Math.floor(normalDistribution(j) * 100); // Scale up to simulate a larger dataset
                  }
                  return sum;
                }),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
              {
                label: 'This Candidate',
                data: Array.from({length: 21}, (_, i) => {
                  const score = 85;
                  return i * 5 <= score && score < (i + 1) * 5 ? 1 : 0; // highlight the score of this candidate
                }),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ]}
            yAxisMax={Math.max(...Array.from({length: 21}, (_, i) => {
              const mean = 65;
              const stdev = 10;
              const normalDistribution = (x: number) => {
                return (1 / (stdev * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * stdev ** 2));
              };
              let sum = 0;
              for (let j = i * 5; j < (i + 1) * 5; j++) {
                sum += Math.floor(normalDistribution(j) * 100); // Scale up to simulate a larger dataset
              }
              return sum;
            }))}
          />
        </CardContent>
      </Card>
      </div>
   
  );
}
