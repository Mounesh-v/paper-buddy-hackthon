import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#171717", "#525252", "#737373", "#a3a3a3", "#d4d4d4"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-3.5 py-2.5 rounded-lg shadow-lg text-xs border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-medium text-neutral-600 dark:text-neutral-300">{data.name}:</span>
          <span className="font-bold text-neutral-900 dark:text-white">{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium text-neutral-600 dark:text-neutral-300">
            {entry.value}
          </span>
          <span className="font-bold text-neutral-900 dark:text-white ml-1">
            ({entry.payload.value})
          </span>
        </div>
      ))}
    </div>
  );
};

const CompletionChart = ({ data = [], height = 260 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-400 text-sm">
        No completion metrics recorded.
      </div>
    );
  }

  const totalValue = data.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="relative" style={{ width: "100%", height }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {totalValue}
        </span>
        <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
          Total Items
        </span>
      </div>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={5}
            cornerRadius={6}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionChart;
