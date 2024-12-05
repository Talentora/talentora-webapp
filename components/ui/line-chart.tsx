 import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
  Tooltip,
   Legend
 } from 'chart.js';
 import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
 Title,
 Tooltip,
 Legend
 );

interface Dataset {
  label: string;
   data: number[];
  borderColor: string;
 backgroundColor: string;
 }

 interface LineChartProps {
   labels: string[];
  datasets: Dataset[];
  title?: string;
}

export default function LineChart({ labels, datasets, title }: LineChartProps) {
   const options = {
    responsive: true,
   plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
       display: !!title,
         text: title
      }
     }
   };

   const data = {
    labels,
     datasets
   };

  return <Line options={options} data={data} />;
 }
