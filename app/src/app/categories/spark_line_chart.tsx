"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SparkLineChart = () => {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      margin: [0, 0, 0, 0],
      height: 25,
      width: 60,
      spacing: [0, 0, 0, 0],
    },
    title: {
      text: "",
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#0B0B0B",
      style: {
        color: "#FFFFFF",
      },
      useHTML: true,
      outside: true,
      hideDelay: 0,
      followPointer: true,
      animation: false,
    },
    series: [
      {
        type: "line",
        data: [0, 1, 0, 5],
        color: "green",
        lineWidth: 2,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default SparkLineChart;
