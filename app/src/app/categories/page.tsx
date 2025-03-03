import SparkLineChart from "./spark_line_chart";
import StackedProgressBar from "./stacked_progress_bar";
import TreeMap from "./tree_map";
import { IoMdArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineAppstore } from "react-icons/ai";
import { BsChevronExpand } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaArrowDown } from "react-icons/fa6";
import { TbDelta } from "react-icons/tb";
import { LuInfo } from "react-icons/lu";
import { HiMiniSignal } from "react-icons/hi2";

const categories = [
  {
    name: "Video",
    current: "2%",
    change: "+1.38",
    positive: true,
  },
  {
    name: "DeFAI",
    current: "9.58%",
    change: "+0.56",
    positive: true,
  },
  {
    name: "Framework",
    current: "9.86%",
    change: "+0.27",
    positive: true,
  },
  {
    name: "Swarm",
    current: "1.69%",
    change: "+0.19",
    positive: true,
  },
  {
    name: "AI Gaming",
    current: "0.42%",
    change: "+0.18",
    positive: true,
  },
  {
    name: "Meme",
    current: "13.23%",
    change: "-5.42",
    positive: false,
  },
  {
    name: "Bittensor",
    current: "0.5%",
    change: "-1.76",
    positive: false,
  },
  {
    name: "Trading",
    current: "0.91%",
    change: "-1.12",
    positive: false,
  },
  {
    name: "3D Models",
    current: "1.37%",
    change: "-0.8",
    positive: false,
  },
  {
    name: "Music",
    current: "0.77%",
    change: "-0.66",
    positive: false,
  },
];

function topCategories(list: any[]) {
  return list
    .sort((a, b) => {
      const aValue = parseFloat(a.mindShare.replace("%", ""));
      const bValue = parseFloat(b.mindShare.replace("%", ""));
      return bValue - aValue; // Sắp xếp giảm dần
    })
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      mindShare: item.mindShare,
    }));
}

const list = [
  {
    order: 1,
    name: "Framework",
    mindShare: "10.75%",
    mindShareChange: "-0.2",
    positiveMindShare: false,
    marketCap: "$1.45B",
    marketCapChange: "+14.28%",
    positiveMarketCap: true,
    echo: "17.4%",
    echoChange: "-0.44",
    positiveEcho: false,
    volume: "$67.75M",
    volumeChange: "+1.14%",
    positiveVolume: true,
  },
  {
    order: 2,
    name: "Meme",
    mindShare: "16.19%",
    mindShareChange: "+3.46",
    positiveMindShare: true,
    marketCap: "$1.41B",
    marketCapChange: "+9.14%",
    positiveMarketCap: true,
    echo: "4.92%",
    echoChange: "-4.31",
    positiveEcho: false,
    volume: "$36.7M",
    volumeChange: "-14.51%",
    positiveVolume: false,
  },
  {
    order: 3,
    name: "DeFAI",
    mindShare: "10.28%",
    mindShareChange: "+0.89",
    positiveMindShare: true,
    marketCap: "$673.9M",
    marketCapChange: "+9.48%",
    positiveMarketCap: true,
    echo: "7.31%",
    echoChange: "-4.74",
    positiveEcho: false,
    volume: "$19.68M",
    volumeChange: "-1.76%",
    positiveVolume: false,
  },
  {
    order: 4,
    name: "Alpha",
    mindShare: "6.48%",
    mindShareChange: "+0.95",
    positiveMindShare: true,
    marketCap: "$334.45M",
    marketCapChange: "+11.09%",
    positiveMarketCap: true,
    echo: "12.62%",
    echoChange: "+6.2",
    positiveEcho: true,
    volume: "$9.42M",
    volumeChange: "-5.88%",
    positiveVolume: false,
  },
  {
    order: 5,
    name: "TEE/deAI Infra",
    mindShare: "1.37%",
    mindShareChange: "+0.24",
    positiveMindShare: true,
    marketCap: "$263.35M",
    marketCapChange: "+7.58%",
    positiveMarketCap: true,
    echo: "3.03%",
    echoChange: "-0.93",
    positiveEcho: false,
    volume: "$2.36M",
    volumeChange: "-39.44%",
    positiveVolume: false,
  },
  {
    order: 6,
    name: "Bittensor",
    mindShare: "0.85%",
    mindShareChange: "-0.15",
    positiveMindShare: false,
    marketCap: "$150.99M",
    marketCapChange: "+14.35%",
    positiveMarketCap: true,
    echo: "1.39%",
    echoChange: "-0.47",
    positiveEcho: false,
    volume: "$926.52K",
    volumeChange: "-31.34%",
    positiveVolume: false,
  },
  {
    order: 7,
    name: "Swarm",
    mindShare: "1.69%",
    mindShareChange: "-0.06",
    positiveMindShare: false,
    marketCap: "$101.75M",
    marketCapChange: "+7.81%",
    positiveMarketCap: true,
    echo: "1.39%",
    echoChange: "-1.42",
    positiveEcho: false,
    volume: "$10.06M",
    volumeChange: "-0.9%",
    positiveVolume: false,
  },
  {
    order: 8,
    name: "Data",
    mindShare: "1.96%",
    mindShareChange: "-0.93",
    positiveMindShare: false,
    marketCap: "$92.62M",
    marketCapChange: "+6.36%",
    positiveMarketCap: true,
    echo: "5.42%",
    echoChange: "-1.69",
    positiveEcho: false,
    volume: "$2.72M",
    volumeChange: "-34.47%",
    positiveVolume: false,
  },
  {
    order: 9,
    name: "3D Models",
    mindShare: "1.2%",
    mindShareChange: "-0.54",
    positiveMindShare: false,
    marketCap: "$52.56M",
    marketCapChange: "-3.32%",
    positiveMarketCap: false,
    echo: "6.31%",
    echoChange: "-0.97",
    positiveEcho: false,
    volume: "$2.43M",
    volumeChange: "-38.03%",
    positiveVolume: false,
  },
  {
    order: 10,
    name: "Music",
    mindShare: "1.2%",
    mindShareChange: "+0.41",
    positiveMindShare: true,
    marketCap: "$50.68M",
    marketCapChange: "+17.84%",
    positiveMarketCap: true,
    echo: "1.39%",
    echoChange: "+1.39",
    positiveEcho: true,
    volume: "$3.23M",
    volumeChange: "+19.77%",
    positiveVolume: true,
  },
  {
    order: 11,
    name: "Trading",
    mindShare: "1.73%",
    mindShareChange: "+0.82",
    positiveMindShare: true,
    marketCap: "$37.86M",
    marketCapChange: "+18.5%",
    positiveMarketCap: true,
    echo: "0%",
    echoChange: "-0.55",
    positiveEcho: false,
    volume: "$1.94M",
    volumeChange: "-2.33%",
    positiveVolume: false,
  },
  {
    order: 12,
    name: "Investment DAO",
    mindShare: "0.28%",
    mindShareChange: "-0.09",
    positiveMindShare: false,
    marketCap: "$34.87M",
    marketCapChange: "+20.99%",
    positiveMarketCap: true,
    echo: "0%",
    echoChange: "-1.5",
    positiveEcho: false,
    volume: "$665.7K",
    volumeChange: "-22.62%",
    positiveVolume: false,
  },
  {
    order: 13,
    name: "App Store",
    mindShare: "3.54%",
    mindShareChange: "+1.75",
    positiveMindShare: true,
    marketCap: "$33.04M",
    marketCapChange: "-14.84%",
    positiveMarketCap: false,
    echo: "3.53%",
    echoChange: "+0.92",
    positiveEcho: true,
    volume: "$9.64M",
    volumeChange: "-59.24%",
    positiveVolume: false,
  },
  {
    order: 14,
    name: "Video",
    mindShare: "4.02%",
    mindShareChange: "+2.05",
    positiveMindShare: true,
    marketCap: "$31.26M",
    marketCapChange: "+18.96%",
    positiveMarketCap: true,
    echo: "2.14%",
    echoChange: "+2.14",
    positiveEcho: true,
    volume: "$262.66K",
    volumeChange: "-39.6%",
    positiveVolume: false,
  },
  {
    order: 15,
    name: "AI Gaming",
    mindShare: "0.19%",
    mindShareChange: "-0.17",
    positiveMindShare: false,
    marketCap: "$22.95M",
    marketCapChange: "+12.39%",
    positiveMarketCap: true,
    echo: "0%",
    echoChange: "-1.4",
    positiveEcho: false,
    volume: "$515.36K",
    volumeChange: "-13.94%",
    positiveVolume: false,
  },
  {
    order: 16,
    name: "Dev Tools",
    mindShare: "0%",
    mindShareChange: "-",
    positiveMindShare: false,
    marketCap: "$21.66M",
    marketCapChange: "+25.81%",
    positiveMarketCap: true,
    echo: "0%",
    echoChange: "-",
    positiveEcho: false,
    volume: "$780.17K",
    volumeChange: "-28.54%",
    positiveVolume: false,
  },
  {
    order: 17,
    name: "Launchpad",
    mindShare: "0.16%",
    mindShareChange: "+0.06",
    positiveMindShare: true,
    marketCap: "$15.17M",
    marketCapChange: "+11.76%",
    positiveMarketCap: true,
    echo: "0%",
    echoChange: "-",
    positiveEcho: false,
    volume: "$702.02K",
    volumeChange: "-21.11%",
    positiveVolume: false,
  },
  {
    order: 18,
    name: "Entertainment",
    mindShare: "0%",
    mindShareChange: "-",
    positiveMindShare: false,
    marketCap: "$217.71K",
    marketCapChange: "-0.94%",
    positiveMarketCap: false,
    echo: "0%",
    echoChange: "-",
    positiveEcho: false,
    volume: "$121.95",
    volumeChange: "-45.65%",
    positiveVolume: false,
  },
];
const Page = () => {
  const top10Categories = topCategories(list);

  return (
    <div className="text-white h-full w-screen m-0 p-0 box-border bg-[#0B0B0B]">
      <div className=" w-full h-[32px]"> </div>

      {/* Navigation */}
      <div className="sticky top-0 flex flex-row w-full items-center gap-2 py-4 bg-[#0B0B0B] border-b border-[#171717] ">
        <div className="flex w-[1300px] mx-auto gap-2">
          <div className="flex items-center gap-2">
            <button className="h-[30px] w-auto bg-[#333333] rounded-full aspect-square flex items-center justify-center">
              <IoMdArrowBack />
            </button>
            <span className="text-sm font-medium">cookie.fun</span>
            <span>
              <IoIosArrowForward className="text-white/60 size-3" />
            </span>
          </div>
          <button className="flex items-center gap-1 border-[#171717] border-[1px] px-2 py-1 rounded">
            <span>
              <AiOutlineAppstore className="size-5" />
            </span>
            <span className="text-sm font-medium">Categories</span>
            <span>
              <BsChevronExpand className="size-3.5" />
            </span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1300px] mx-auto h-full">
        <div className="flex items-center gap-2 py-4 ">
          <span>
            <AiOutlineAppstore className="size-7" />
          </span>
          <span className="text-[24px] font-semibold">Categories</span>
        </div>

        {/* Info */}
        <div className="flex border rounded border-[#171717]">
          <div className="flex-1 h-full border-r border-[#171717]">
            <div className="w-full flex justify-between px-4 pt-3 pb-4 ">
              <span className="text-sm font-medium">Dominance</span>
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1 border border-[#171717] px-1 py-0.5 rounded">
                  <span className="text-sm font-medium">Market Cap</span>
                  <span>
                    <BsChevronExpand className="size-3" />
                  </span>
                </button>
                <span>
                  <AiOutlineLineChart className="bg-[#333333] size-6 rounded aspect-square" />
                </span>
              </div>
            </div>

            {/* Meme Framework DeFAI and Progress Bar */}
            <div className="px-4 pb-4 border-b border-[#171717]">
              {/* 3 box */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="h-1 w-7 bg-[#9FFAC9] rounded-full mb-2"></div>
                  <div className="text-sm">Meme</div>
                  <div className="text-[24px] font-semibold">30%</div>
                  <div className="text-white/40 text-sm">$1.27B</div>
                </div>

                <div className="flex-1">
                  <div className="h-1 w-7 bg-[#FF7C40] rounded-full mb-2"></div>
                  <div className="text-sm">Framework</div>
                  <div className="text-[24px] font-semibold">30%</div>
                  <div className="text-white/40 text-sm">$1.27B</div>
                </div>

                <div className="flex-1">
                  <div className="h-1 w-7 bg-[#333333] rounded-full mb-2"></div>
                  <div className="text-sm">DeFAI</div>
                  <div className="text-[24px] font-semibold">14%</div>
                  <div className="text-white/40 text-sm">$604.34M</div>
                </div>
              </div>

              {/* Progress Bar */}
              <StackedProgressBar />
            </div>

            {/* Top gainers 2 box */}
            <div className="flex">
              <div className="flex flex-col flex-1 px-4 pb-4 pt-3 gap-4 border-r border-[#171717]">
                <div className="text-sm font-medium">
                  Top gainers by Market cap (24H)
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span className="text-sm">App Store</span>
                  <span className="text-sm text-green-500">+3.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span className="text-sm">App Store</span>
                  <span className="text-sm text-green-500">+3.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span className="text-sm">App Store</span>
                  <span className="text-sm text-green-500">+3.5%</span>
                </div>
              </div>
              <div className="flex flex-col flex-1 px-4 pb-4 pt-3 gap-4">
                <div className="text-sm font-medium">
                  Top gainers by Market cap (24H)
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span className="text-sm">App Store</span>
                  <span className="text-sm text-green-500">+3.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span className="text-sm">App Store</span>
                  <span className="text-sm text-green-500">+3.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span className="text-sm">App Store</span>
                  <span className="text-sm text-green-500">+3.5%</span>
                </div>
              </div>
            </div>
          </div>
          {/* Top 10 Categories Image*/}
          <div className="flex-1 px-4 pt-3 pb-4 h-full">
            {/* Nav */}
            <div className="flex items-center gap-2 pb-4">
              <span className="text-sm font-medium">Top 10 Categories by</span>
              <button className="flex items-center gap-1 border border-[#171717] px-1 py-0.5 rounded">
                <span className="text-sm font-medium">Mindshare</span>
                <span>
                  <BsChevronExpand className="size-3" />
                </span>
              </button>
              <span className="text-sm font-medium">(last 24H)</span>
            </div>

            {/* Image */}

            <TreeMap data={top10Categories} />
          </div>

          {/* Top 10 Categories */}
          <div className="flex-1 px-4 pt-3 pb-4 h-[359px]">
            <table className="w-full h-full">
              <thead>
                <tr className="bg-[#171717] text-left ">
                  <th className="text-[10px] font-light py-1 w-[50%]">
                    Categories
                  </th>
                  <th className="text-[10px] font-light py-1 w-[25%]">
                    Current
                  </th>
                  <th className="text-[10px] font-light w-[25%]">
                    <div className="py-1 flex items-center gap-1 justify-end">
                      24h
                      <FaArrowDown className="size-2" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.name}>
                    <td className="text-xs font-medium w-[50%]">
                      {category.name}
                    </td>
                    <td className="text-xs font-medium w-[25%]">
                      {category.current}
                    </td>
                    <td
                      className={`text-xs text-right w-[25%] ${
                        category.positive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {category.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details */}
        <div className="w-full px-4 mt-8 overflow-x-auto border rounded border-[#171717]">
          <table className="w-full h-full">
            <thead className="text-[12px] text-left">
              <tr>
                <th className="py-[10px]">#</th>
                <th className="py-[10px]">Category name</th>
                <th className="py-[10px]">Mindshare</th>
                <th className="py-[10px]">
                  <div className="flex items-center gap-1">
                    <TbDelta />
                    24H
                  </div>
                </th>
                <th className="py-[10px]">
                  <div className="flex items-center gap-1">
                    Market Cap
                    <FaArrowDown className="size-3" />
                  </div>
                </th>
                <th className="py-[10px]">
                  <div className="flex items-center gap-1">
                    <TbDelta />
                    24H
                  </div>
                </th>
                <th className="py-[10px]">
                  <div className="flex items-center gap-1">
                    <HiMiniSignal color="green" />
                    Echo
                    <LuInfo />
                  </div>
                </th>
                <th className="py-[10px]">
                  <div className="flex items-center gap-1">
                    <TbDelta />
                    24H
                  </div>
                </th>
                <th className="py-[10px]">Volume</th>
                <th className="py-[10px]">
                  <div className="flex items-center gap-1">
                    <TbDelta />
                    24H
                  </div>
                </th>
                <th className="py-[10px]">Top by Market Cap</th>
                <th className="py-[10px]">Top by MindShare</th>
              </tr>
            </thead>

            <tbody>
              {list.map((item) => (
                <tr key={item.name}>
                  <td className="py-[10px] text-sm">{item.order}</td>
                  <td className="py-[10px] text-lg font-medium">{item.name}</td>
                  <td className="py-[10px] text-sm">{item.mindShare}</td>
                  <td
                    className={`text-sm ${
                      item.positiveMindShare ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.mindShareChange}
                  </td>
                  <td className="flex py-[10px] text-sm items-center">
                    <div className="flex-1">
                      <span>{item.marketCap}</span>
                    </div>

                    <div className="flex-1">
                      <SparkLineChart />
                    </div>
                  </td>
                  <td
                    className={`text-sm ${
                      item.positiveMarketCap ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.marketCapChange}
                  </td>
                  <td className="py-[10px] text-sm">{item.echo}</td>
                  <td
                    className={`text-sm ${
                      item.positiveEcho ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.echoChange}
                  </td>
                  <td className="py-[10px] text-sm">{item.volume}</td>
                  <td
                    className={`text-sm ${
                      item.positiveVolume ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.volumeChange}
                  </td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <div className="w-[33px] aspect-square bg-red-500 rounded"></div>
                      <div className="w-[33px] aspect-square bg-red-500 rounded"></div>
                      <div className="w-[33px] aspect-square bg-red-500 rounded"></div>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <div className="w-[33px] aspect-square bg-red-500 rounded"></div>
                      <div className="w-[33px] aspect-square bg-red-500 rounded"></div>
                      <div className="w-[33px] aspect-square bg-red-500 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-[#0B0B0B] h-[50px] w-full"></div>
    </div>
  );
};

export default Page;
