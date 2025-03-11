import { FaGlobe, FaTwitter } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import { HiLink } from "react-icons/hi2";
import PriceChart from "../components/chart/Pricechart";
import PriceChart2 from "../components/chart/Pricechart2";
import PriceChart3 from "../components/chart/Pricechart3";
import AssetItem from "../components/custom/Asset_value";
import Transaction from "../components/custom/Transaction";
import { createFileRoute } from "@tanstack/react-router";


const Profile = () => {
    return (
    <div
        className="container min-h-screen mx-auto box-border bg-[#0A0D16]"
    >
      {/* Header */}
        <div className="">
        <div className ="flex">
        <div className="w-auto h-full flex">
          {/* Logo */}
            <div className="w-[200px] h-[200px] rounded-full bg-red-800 mx-3"></div>

          {/* Info */}
          <div className="h-full w-auto flex flex-col justify-evenly">
            <div className="text-white text-2xl">Tesla</div>

            <div className="flex items-center leading-none gap-3">
              <div className="text-white text-3xl">$100,000,000</div>
              <span
                className="text-xl"
                style={{ color: "#8CDB92", opacity: "0.8" }}
              >
                +$7.09M
              </span>
              <div className="flex items-center gap-4">
                {/* Globe and Twitter icons with dividers */}
                <div className="flex items-center">
                  <div className="w-[1px] h-4 bg-[#2C2D30]"></div>
                  <div className="mx-3 flex items-center gap-3">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <FaGlobe size={18} color="#5869D1" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <FaTwitter size={18} color="#5869D1" />
                    </button>
                  </div>
                  <div className="w-[1px] h-4 bg-[#2C2D30]"></div>
                </div>

                {/* Share button */}
                <button className="flex items-center gap-2 bg-[#5869D1] text-white px-2 py-1 rounded">
                  <IoShareOutline size={18} />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
            <div className=" flex gap-3 ">
              <span
                className="text-white/80 text-xs w-auto px-2 py-1 rounded-full"
                style={{ backgroundColor: "#211F26" }}
              >
                Custodian
              </span>
              <span
                className="text-white/80 text-xs w-auto px-2 py-1 rounded-full"
                style={{ backgroundColor: "#211F26" }}
              >
                Coinbase Prime Custody
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end items-center w-full h-full ">
          <div className="flex flex-col gap-2">
            <button className="bg-[#1F1F2D] px-2 py-1 rounded-[6px]">
              <div className="flex items-center gap-2 text-white">
                <HiOutlineMenuAlt2 size={20} className="text-white" />
                <HiLink size={18} className="text-white" />
                <div className="w-[1px] h-4 bg-[white]"></div>
                <span className="text-sm font-medium ml-1">ALL NETWORKS</span>
              </div>
            </button>
            {/* Visualize link */}
            <div className="flex items-center gap-2 text-[#6c5dd3] hover:text-[#5c4ec3] transition-colors cursor-pointer">
              <span
                className="text-sm"
                style={{ color: "#5869D1", opacity: "0.8" }}
              >
                Visualize
              </span>
            </div>
          </div>
        </div>
        </div>
      {/* Body */}
        <div className ="flex">
        <div className="w-[calc(100%-400px)] rounded relative">
        <div className="flex justify-between m-3 h-[calc(100%/3)]">
          {/* Left side - PnL Stats */}
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm mb-1">Last 7D PnL</span>
            <div className="flex flex-col">
              <span className="text-[#8DDB90] text-2xl font-bold">+12003%</span>
              <div className="flex items-center gap-1">
                <span className="text-[#8DDB90] text-sm">+$6M</span>
                <span className="text-gray-400 text-xs">USD</span>
              </div>
            </div>
          </div>

          {/* Right side - Win Rate */}
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-sm mb-1">Win Rate</span>
            <span className="text-white text-2xl font-bold">100%</span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <span>Bal:</span>
              <span className="text-[#8DDB90]">0 SOL</span>
              <span className="text-gray-500">($0)</span>
            </div>
          </div>
          <div className="w-20 h-auto  absolute bottom-0 right-3">
            <PriceChart3 />
          </div>
        </div>
        </div>

        <div className="rounded w-[calc(100%-400px)]">
        <div className="flex w-full text-white ">
          <div className="w-1/2 text-center py-1">BALANCES HISTORY</div>
          <div className="w-1/2 text-center py-1 ">PROFIT & LOSS</div>
        </div>
        <PriceChart />
        </div>
        </div>

        <div className="flex gap-3">
        <div className="flex flex-col gap-3 w-[calc(100%-500px)]">
        <div className="rounded">
        <AssetItem />
        </div>
        <div className="rounded flex flex-col-reverse"
        style={{ backgroundColor: boxColor }}
      >
        <PriceChart2 />
        </div>
        </div>

        <div className="w-full h-full rounded "  >        
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-[#663B9D] bg-opacity-40 rounded-full border-2 border-[#663B9D] text-[#A878E6] font-bold">
              @smartestmoney
            </span>
            <span className="text-xs px-2 py-1 bg-[#213D7A] bg-opacity-40 rounded-full border-2 border-[#213D7A] text-[#5479E0] font-bold">
              USD &ge; $0.10
            </span>
            <span className="text-xs px-2 py-1 bg-[#3B7CA5] bg-opacity-40 rounded-full border-2 border-[#3B7CA5] text-[#6FB8E6] font-bold ">
              SORT BY TIME
            </span>
          </div>
          <div className="rounded p-3" style={{ backgroundColor: boxColor }}>
            <div className="flex justify-center mb-3 gap-2">
              <span className="text-white">TRANSACTIONS</span>
              <span className="text-white flex items-center gap-2">
                <MdOutlineNavigateBefore size={24} />
                1/ 26
                <MdOutlineNavigateNext size={24} />
              </span>
            </div>
            <Transaction />
          </div>
        </div>
        </div>
        </div>

        </div>
    </div>
    );
};


export const Route = createFileRoute("/profile/$address")({
    component: Profile
});

const boxColor = "#16171D";