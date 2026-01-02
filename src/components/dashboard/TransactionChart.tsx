import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { date: "Dec 25", volume: 2400000, buy: 1400000, sell: 1000000 },
  { date: "Dec 26", volume: 1398000, buy: 800000, sell: 598000 },
  { date: "Dec 27", volume: 9800000, buy: 5200000, sell: 4600000 },
  { date: "Dec 28", volume: 3908000, buy: 2100000, sell: 1808000 },
  { date: "Dec 29", volume: 4800000, buy: 2800000, sell: 2000000 },
  { date: "Dec 30", volume: 3800000, buy: 2000000, sell: 1800000 },
  { date: "Dec 31", volume: 4300000, buy: 2500000, sell: 1800000 },
];

export function TransactionChart() {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Transaction Volume</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Buy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Sell</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(234, 89%, 54%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(234, 89%, 54%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 32%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`₦${(value / 1000000).toFixed(2)}M`, ""]}
            />
            <Area
              type="monotone"
              dataKey="buy"
              stroke="hsl(234, 89%, 54%)"
              strokeWidth={2}
              fill="url(#colorBuy)"
            />
            <Area
              type="monotone"
              dataKey="sell"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#colorSell)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
