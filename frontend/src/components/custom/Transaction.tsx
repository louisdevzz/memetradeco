"use client";

interface Transaction {
  time: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  value: string;
}

export default function TransactionList() {
  const transactions: Transaction[] = [
    {
      time: "3 days ago",
      from: "@sma",
      to: "@sm",
      amount: "5",
      token: "USDT",
      value: "$5.00",
    },
    {
      time: "3 days ago",
      from: "@sma",
      to: "@sm",
      amount: "5M",
      token: "USDT",
      value: "$5.00M",
    },
    {
      time: "3 days ago",
      from: "@sma",
      to: "@sm",
      amount: "10M",
      token: "USDT",
      value: "$10.00M",
    },
    {
      time: "6 days ago",
      from: "@sma",
      to: "@sm",
      amount: "8.358K",
      token: "USDT",
      value: "$8.36K",
    },
    {
      time: "3 weeks ago",
      from: "@sma",
      to: "@sm",
      amount: "2.453K",
      token: "USDT",
      value: "$2.45K",
    },
    {
      time: "1 month ago",
      from: "@sma",
      to: "@sm",
      amount: "20.492K",
      token: "PORTAL",
      value: "$16.76K",
    },
    {
      time: "1 month ago",
      from: "@d1",
      to: "@sm",
      amount: "20.492K",
      token: "PORTAL",
      value: "$16.83K",
    },
  ];

  return (
    <div>
      {/* Headers */}
      <div className="flex items-center text-gray-500 text-sm mb-4">
        <div className="w-[15%]">TIME</div>
        <div className="w-[20%]">FROM</div>
        <div className="w-[20%]">TO</div>
        <div className="w-[15%]">VALUE</div>
        <div className="w-[15%]">TOKEN</div>
        <div className="w-[15%]">USD</div>
      </div>

      {/* Transactions */}
      <div className="flex flex-col gap-3">
        {transactions.map((tx, index) => (
          <div key={index} className="flex items-center">
            <div className="w-[15%]">
              <span className="text-[#3B82F6]">{tx.time}</span>
            </div>
            <div className="w-[20%]">
              <span className="text-gray-300">{tx.from}</span>
            </div>
            <div className="w-[20%]">
              <span className="text-gray-300">{tx.to}</span>
            </div>
            <div className="w-[15%] text-[#22C55E]">{tx.amount}</div>
            <div className="w-[15%]">
              <span className="text-gray-300">{tx.token}</span>
            </div>
            <div className="w-[15%] text-gray-300">{tx.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}