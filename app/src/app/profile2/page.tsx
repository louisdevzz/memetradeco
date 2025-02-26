"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function PriceChart() {
  const options: Highcharts.Options = {
    chart: {
      type: "area",
      height: "270",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ["Feb", "Jul", "2022", "Jun", "2023", "Jun", "2024"],
      labels: {
        style: {
          color: "#000",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineWidth: 0.5,
      gridLineColor: "#E0E0E0",
    },
    series: [
      {
        type: "area",

        data: [
          10000000, 15000000, 20000000, 35000000, 30000000, 40000000, 20000000,
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
