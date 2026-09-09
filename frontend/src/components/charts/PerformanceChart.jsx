import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-4 py-3 rounded-lg shadow-lg text-xs border border-neutral-200 dark:border-neutral-800">
        <p className="font-bold text-neutral-900 dark:text-white mb-1">{label}</p>
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
          <span className="font-medium text-neutral-500 dark:text-neutral-400">Mastery Rating:</span>
          <span className="font-bold text-neutral-900 dark:text-white text-sm">
            {payload[0].value}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ data = [], height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-400 text-sm">
        No performance history available yet.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#171717" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#171717" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#a3a3a3"
            opacity={0.2}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            stroke="#a3a3a3"
            fontSize={11}
            dy={10}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            stroke="#a3a3a3"
            fontSize={11}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#171717"
            strokeWidth={2}
            activeDot={{
              r: 5,
              fill: "#171717",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
