"use client";

import { CircleDot, Send } from "lucide-react";

export default function MobyContentpage() {
  return (
    <div className="flex-1">
      {/* Stats Section */}
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-12">
            <div className="p-4 lg:p-0">
              <p className="text-gray-500 text-sm lg:text-base mb-2">Total Whale Buys</p>
              <p className="text-lg lg:text-3xl font-bold">3.40K</p>
            </div>
            <div className="p-4 lg:p-0">
              <p className="text-gray-500 text-sm lg:text-base mb-2">Total Whale Sells</p>
              <p className="text-lg lg:text-3xl font-bold">7.83K</p>
            </div>
            <div className="p-4 lg:p-0">
              <p className="text-gray-500 text-sm lg:text-base mb-2">Total Whale Volume</p>
              <p className="text-lg lg:text-3xl font-bold">$191.44M</p>
            </div>
            <div className="p-4 lg:p-0">
              <p className="text-gray-500 text-sm lg:text-base mb-2">Largest Trade</p>
              <p className="text-lg lg:text-3xl font-bold">$679.78K</p>
            </div>
            <div className="p-4 lg:p-0">
              <p className="text-gray-500 text-sm lg:text-base mb-2">Avg Market Cap</p>
              <p className="text-lg lg:text-3xl font-bold">$367.37M</p>
            </div>
          </div>
        </div>

        {/* Top 10 Traders Section */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Top 10 Traders</h2>
          <div className="space-y-3 lg:space-y-4">
            {[
              { rank: 1, trades: 381, volume: "$90.40K", address: "K0EhCW" },
              { rank: 2, trades: 135, volume: "$7.38M", address: "XXFSB0" },
              { rank: 3, trades: 245, volume: "$5.92M", address: "9XKP2W" },
              { rank: 4, trades: 198, volume: "$4.76M", address: "M7NHV5" },
              { rank: 5, trades: 167, volume: "$3.89M", address: "R4TUQ8" },
              { rank: 6, trades: 156, volume: "$3.45M", address: "B2YJL9" },
              { rank: 7, trades: 134, volume: "$2.98M", address: "E6WKS3" },
              { rank: 8, trades: 122, volume: "$2.54M", address: "H9VFD4" },
              { rank: 9, trades: 108, volume: "$2.12M", address: "U3ZMC7" },
              { rank: 10, trades: 95, volume: "$1.87M", address: "G5XNA1" }
            ].map((trader) => (
              <div 
                key={trader.rank}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-3 lg:p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 lg:gap-6 mb-2 md:mb-0">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded flex items-center justify-center text-sm lg:text-base font-semibold">
                    {trader.rank}
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium">Trades: {trader.trades}</p>
                    <p className="text-gray-500 text-sm lg:text-base">Volume: {trader.volume}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-2 lg:gap-4 mt-2 md:mt-0">
                  <span className="text-gray-500 text-sm lg:text-base">{trader.address}</span>
                  <div className="flex gap-1 lg:gap-2">
                    <button className="p-1.5 lg:p-2 hover:bg-gray-200 rounded-full">
                      <CircleDot className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
                    </button>
                    <button className="p-1.5 lg:p-2 hover:bg-gray-200 rounded-full">
                      <Send className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
