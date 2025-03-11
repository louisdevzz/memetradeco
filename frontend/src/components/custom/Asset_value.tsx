"use client";

interface AssetItem {
  symbol: string;
  value: number;
}

export default function AssetList() {
  const assets: AssetItem[] = [
    { symbol: "AETHUSDT", value: 10005647.08 },
    { symbol: "SUDO", value: 33435.42 },
    { symbol: "USDT", value: 14775.63 },
    { symbol: "ETH", value: 13901.92 },
    { symbol: "INNBC", value: 499.6 },
    { symbol: "USDC", value: 209.27 },
    { symbol: "MTV", value: 1.22 },
    { symbol: "PUMP", value: 0.47 },
  ];

  return (
    <div className="bg-[#16171D] p-3 rounded">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-red-600"></div>
        <span className="text-gray-400">@smartestmoney_</span>
      </div>

      {/* Total Value */}
      <div className="text-white text-2xl font-bold mb-4">
        ${(10068470.78).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </div>

      {/* Column Headers */}
      <div className="flex justify-between mb-3">
        <span className="text-gray-500 text-sm">ASSET</span>
        <span className="text-gray-500 text-sm">VALUE</span>
      </div>

      {/* Asset List */}
      <div className="flex flex-col gap-3">
        {assets.map((asset) => (
          <div key={asset.symbol} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span className="text-gray-300">{asset.symbol}</span>
            </div>
            <span className="text-gray-300">
              $
              {asset.value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}