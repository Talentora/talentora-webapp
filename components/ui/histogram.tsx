import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }
  
  interface HistogramChartProps {
    labels: string[];
    datasets: Dataset[];
    title?: string;
    yAxisMax?: number;
  }
  
  export default function HistogramChart({ 
    labels, 
    datasets, 
    title,
    yAxisMax = 100 
  }: HistogramChartProps) {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: !!title,
          text: title,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: yAxisMax,
          ticks: {
            stepSize: 20,
          },
        },
      },
      barPercentage: 0.9,
      categoryPercentage: 0.9,
    };
  
    const data = {
      labels,
      datasets,
    };
  
    return <Bar options={options} data={data} />;
  }