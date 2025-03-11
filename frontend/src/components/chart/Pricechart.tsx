"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function PriceChart() {
  const options: Highcharts.Options = {
    chart: {
      type: "area",
      height: "270",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ["Feb", "Jul", "2022", "Jun", "2023", "Jun", "2024"],

      labels: {
        style: {
          color: "#FFFFFF",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineWidth: 0.5,
      gridLineColor: "#333333",
      labels: {
        style: {
          color: "#FFFFFF",
        },
      },
    },
    series: [
      {
        type: "area",
        color: "#2563eb",
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "rgba(37, 99, 235, 0.5)"],
            [1, "rgba(37, 99, 235, 0)"],
          ],
        },
        data: [
          1000000000, 15000000, 20000000, 35000000, 30000000, 40000000,
          20000000,
        ],
      },
    ],
    legend: {
      enabled: false,
    },
  };

  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}