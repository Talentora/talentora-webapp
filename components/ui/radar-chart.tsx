import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Radar } from 'react-chartjs-2';
  
  // Register ChartJS components
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );
  
  interface RadarChartProps {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
    }[];
  }
  
  export default function RadarChart({ labels, datasets }: RadarChartProps) {
    const data = {
      labels,
      datasets: datasets.map(dataset => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || 'rgba(255, 99, 132, 0.2)',
        borderColor: dataset.borderColor || 'rgba(255, 99, 132, 1)',
        borderWidth: dataset.borderWidth || 1,
      })),
    };
  
    const options = {
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 100, // Adjust this based on your data range
          ticks: {
            stepSize: 20,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  
    return <Radar data={data} options={options} />;
  }