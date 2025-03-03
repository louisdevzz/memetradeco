"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TreemapModule from "highcharts/modules/treemap.js";

// Kích hoạt module treemap
if (typeof window !== "undefined") {
  TreemapModule(Highcharts);
}
interface Category {
  name: string;
  mindShare: string;
}

interface TreeMapProps {
  data: Category[];
}

const TreeMap = ({ data }: TreeMapProps) => {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "treemap",
      backgroundColor: "transparent",
      height: 290,
      margin: 0,
      spacing: [0, 0, 0, 0],
    },
    title: {
      text: "",
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
        type: "treemap",
        layoutAlgorithm: "squarified",
        data: data.map((item) => ({
          name: item.name,
          value: parseFloat(item.mindShare.replace("%", "")),
          color:
            item.name === "Meme"
              ? "#9FFAC9"
              : item.name === "Framework"
              ? "#FF7C40"
              : item.name === "DeFAI"
              ? "#333333"
              : "#171717",
        })),
        dataLabels: {
          enabled: true,
          style: {
            color: "#FFFFFF",
            fontSize: "10px",
            fontWeight: "normal",
          },
        },
        levels: [
          {
            level: 1,
            dataLabels: {
              enabled: true,
              align: "left",
              verticalAlign: "top",
              style: {
                fontSize: "10px",
                fontWeight: "normal",
              },
            },
            borderWidth: 0,
          },
        ],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default TreeMap;
