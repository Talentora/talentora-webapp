import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart1 = ({ data }: { data: any ,}) => {
  const radarOptions = {
    scales: {
      r: {
        ticks: {
          display: false,
          beginAtZero: false,
          stepSize: 20,
        },
        grid: {
          display: true,
          lineWidth: 0.8,
        },
        min: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    layout: {
      padding: {
          top: 20,  // Adjust padding if needed
          bottom: 20,
      },
  },
  };

  const minQualRadarData = {
    labels: data.min_qual_scores.map((score: any) => Object.keys(score)[0]),
    datasets: [
      {
        label: "Minimum Qualification Scores",
        data: data.min_qual_scores.map((score: any) => Object.values(score)[0]),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  return <Radar data={minQualRadarData} options={radarOptions}/>;
};

export default RadarChart1;
