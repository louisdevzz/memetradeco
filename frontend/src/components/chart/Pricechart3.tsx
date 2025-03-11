"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function BarChart() {
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      width: 90,
      height: 180,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ["", "", "", "", "", "", ""],
      lineWidth: 0,
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
    },
    series: [
      {
        type: "column",
        data: [2, 80, 50, 2, 2],
        color: "#4ade80", // Green color (you can adjust)
        borderWidth: 0,
        pointPadding: 0,
        groupPadding: 0.1,
      },
    ],
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderRadius: 2,
      },
    },
  };

  return (
    <div className="w-[90px]">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}