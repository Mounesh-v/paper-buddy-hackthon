import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DEFAULT_ANALYTICS_DATA = [
  { name: "Chemical Eq.", collected: 94, total: 90, score: 92 },
  { name: "Linear Eq.", collected: 88, total: 88, score: 88 },
  { name: "Microorganisms", collected: 82, total: 85, score: 83.5 },
  { name: "Rational Num.", collected: 78, total: 78, score: 78 },
  { name: "Agriculture", collected: 72, total: 72, score: 72 },
];

const CustomTooltip = ({ active, payload, label, collectedLabel, totalLabel }) => {
  if (active && payload && payload.length) {
    const collectedVal = payload.find((p) => p.dataKey === "collected")?.value || 0;
    const remainingVal = payload.find((p) => p.dataKey === "remaining")?.value || 0;
    const totalVal = collectedVal + remainingVal;

    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[170px]">
        <p className="font-bold text-neutral-900 dark:text-white mb-1.5">{label}</p>
        <div className="flex items-center justify-between gap-3 text-neutral-600 dark:text-neutral-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#2563eb]" />
            {collectedLabel}:
          </span>
          <span className="font-bold text-[#2563eb]">{collectedVal}%</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-neutral-600 dark:text-neutral-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#eaeffd] dark:bg-neutral-700 border border-blue-200 dark:border-neutral-600" />
            {totalLabel}:
          </span>
          <span className="font-bold text-neutral-800 dark:text-neutral-200">{totalVal}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const ClassAnalyticsChart = ({
  data = DEFAULT_ANALYTICS_DATA,
  height = 280,
  collectedLabel = "Quiz Average %",
  totalLabel = "Homework Average %",
}) => {
  const processedData = (data && data.length > 0 ? data : DEFAULT_ANALYTICS_DATA).map(
    (item) => {
      const collected = item.collected ?? item.averageAssessmentScore ?? item.score ?? item.average ?? 75;
      const total = item.total ?? item.averageHomeworkScore ?? item.highest ?? 85;
      const remaining = Math.max(0, total - collected);
      return {
        name: item.name || item.topicName || item.subject || item.label || "Topic",
        collected,
        remaining,
        total,
      };
    }
  );

  return (
    <div className="w-full space-y-3">
      {/* Top Legend */}
      <div className="flex items-center gap-6 px-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 bg-[#2563eb] rounded-xs inline-block" />
          <span>{collectedLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 bg-[#eaeffd] dark:bg-neutral-700 border border-blue-200 dark:border-neutral-600 rounded-xs inline-block" />
          <span>{totalLabel}</span>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            barCategoryGap="18%"
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              stroke="#6b7280"
              fontSize={11}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              stroke="#6b7280"
              fontSize={11}
            />
            <Tooltip
              content={
                <CustomTooltip
                  collectedLabel={collectedLabel}
                  totalLabel={totalLabel}
                />
              }
              cursor={{ fill: "rgba(37, 99, 235, 0.04)" }}
            />
            <Bar
              dataKey="collected"
              stackId="a"
              fill="#2563eb"
              barSize={32}
            />
            <Bar
              dataKey="remaining"
              stackId="a"
              fill="#eaeffd"
              radius={[3, 3, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClassAnalyticsChart;
