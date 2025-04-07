import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const BarChart = ({
  title = "Evaluation Rating",
  labels = [],
  datasetLabel = "Score",
  scores = [],
  maxScore = 5,
  color = "rgba(59, 130, 246)", // default: Tailwind blue-500
  borderColor = "rgba(59, 130, 246, 1)",
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: scores,
        backgroundColor: color,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 18 },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxScore,
      },
    },
  };

  return (
    <div className="flex max-w-200">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
