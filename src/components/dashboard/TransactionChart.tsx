import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Mon", openxswitch: 42000000, yellowcard: 24000000 },
  { name: "Tue", openxswitch: 38000000, yellowcard: 21000000 },
  { name: "Wed", openxswitch: 51000000, yellowcard: 29000000 },
  { name: "Thu", openxswitch: 46000000, yellowcard: 32000000 },
  { name: "Fri", openxswitch: 58000000, yellowcard: 38000000 },
  { name: "Sat", openxswitch: 39000000, yellowcard: 26000000 },
  { name: "Sun", openxswitch: 32000000, yellowcard: 21000000 },
];

export function TransactionChart() {
  return (
    <div className="content-card p-6">
      <div className="content-card-header mb-6 px-0 py-0 border-none">
        <h3 className="content-card-title">Volume by Provider (7 days)</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">OpenXSwitch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Yellow Card</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorOpenx" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="openxswitch"
            name="OpenXSwitch"
            stroke="hsl(var(--primary))"
            fill="url(#colorOpenx)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="yellowcard"
            name="Yellow Card"
            stroke="hsl(var(--warning))"
            fill="url(#colorYellow)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
