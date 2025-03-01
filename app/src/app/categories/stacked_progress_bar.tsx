"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StackedProgressBar = () => {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "bar",
      borderWidth: 0,
      backgroundColor: "transparent",
      height: 25,
      margin: [14, 0, 0, 0],
    },
    title: {
      text: "",
    },
    xAxis: {
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
      lineWidth: 0,
      tickLength: 0,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        stacking: "percent",
        dataLabels: {
          enabled: false,
        },
        borderWidth: 0,
        enableMouseTracking: true,
      },
      bar: {},
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
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "DeFAI",
        type: "bar",
        data: [60.4],
        color: "#333333",
      },
      {
        name: "framework",
        type: "bar",
        data: [127],
        color: "#FF7C40",
      },
      {
        name: "meme",
        type: "bar",
        data: [127],
        color: "#9FFAC9",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default StackedProgressBar;
