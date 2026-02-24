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
  { name: "Mon", send: 42000, receive: 24000, swap: 18000 },
  { name: "Tue", send: 38000, receive: 21000, swap: 15000 },
  { name: "Wed", send: 51000, receive: 29000, swap: 22000 },
  { name: "Thu", send: 46000, receive: 32000, swap: 19000 },
  { name: "Fri", send: 58000, receive: 38000, swap: 28000 },
  { name: "Sat", send: 39000, receive: 26000, swap: 14000 },
  { name: "Sun", send: 32000, receive: 21000, swap: 12000 },
];

export function TransactionChart() {
  return (
    <div className="content-card flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="content-card-title">Volume by Type (7d)</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Send</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Receive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Swap</span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-5 pt-4">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReceive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSwap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px hsl(var(--foreground) / 0.08)",
                fontSize: 13,
              }}
              formatter={(value: number) => [`${(value / 1000).toFixed(1)}K USDT`, ""]}
            />
            <Area
              type="monotone"
              dataKey="send"
              name="Send"
              stroke="hsl(var(--primary))"
              fill="url(#colorSend)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="receive"
              name="Receive"
              stroke="hsl(var(--success))"
              fill="url(#colorReceive)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="swap"
              name="Swap"
              stroke="hsl(var(--warning))"
              fill="url(#colorSwap)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
