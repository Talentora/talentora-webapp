import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = () => {
  const data = {
    labels: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    datasets: [
      {
        label: "Skill Analysis",
        data: [65, 59, 90, 81, 56],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        ticks: {
          display: false,
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Skill Analysis</h2>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
