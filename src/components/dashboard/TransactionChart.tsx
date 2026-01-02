import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", send: 42000000, receive: 24000000, swap: 18000000 },
  { name: "Tue", send: 38000000, receive: 21000000, swap: 15000000 },
  { name: "Wed", send: 51000000, receive: 29000000, swap: 22000000 },
  { name: "Thu", send: 46000000, receive: 32000000, swap: 19000000 },
  { name: "Fri", send: 58000000, receive: 38000000, swap: 28000000 },
  { name: "Sat", send: 39000000, receive: 26000000, swap: 14000000 },
  { name: "Sun", send: 32000000, receive: 21000000, swap: 12000000 },
];

export function TransactionChart() {
  return (
    <div className="content-card p-6">
      <div className="content-card-header mb-6 px-0 py-0 border-none">
        <h3 className="content-card-title">Volume by Type (7 days)</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">SEND</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">RECEIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">SWAP</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReceive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSwap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`₦${(value / 1000000).toFixed(1)}M`, ""]}
          />
          <Area
            type="monotone"
            dataKey="send"
            name="SEND"
            stroke="hsl(var(--primary))"
            fill="url(#colorSend)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="receive"
            name="RECEIVE"
            stroke="hsl(var(--success))"
            fill="url(#colorReceive)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="swap"
            name="SWAP"
            stroke="hsl(var(--warning))"
            fill="url(#colorSwap)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}