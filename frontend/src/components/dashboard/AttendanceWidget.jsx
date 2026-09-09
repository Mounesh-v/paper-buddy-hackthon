import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";

const TABS = ["Students", "Teachers", "Staff"];

const AttendanceWidget = ({ percentage = 98.8, stats = {} }) => {
  const [activeTab, setActiveTab] = useState("Students");

  const data = [
    { name: "Present", value: percentage },
    { name: "Absent", value: 100 - percentage },
  ];

  const COLORS = ["#3d5ee1", "#e8ecf4"];

  return (
    <div className="card-panel p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#202c4b] dark:text-white">
          Attendance
        </h3>
        <button className="flex items-center gap-1 text-xs text-neutral-500 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1">
          Today <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-neutral-50 dark:bg-neutral-800 p-1 rounded-lg">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
              activeTab === tab
                ? "bg-white dark:bg-neutral-700 text-[#3d5ee1] shadow-sm"
                : "text-neutral-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        {[
          { label: "Emergency", value: stats.emergency ?? 16, color: "text-orange-500" },
          { label: "Absent", value: stats.absent ?? 2, color: "text-red-500" },
          { label: "Late", value: stats.late ?? 14, color: "text-blue-500" },
        ].map((item) => (
          <div key={item.label}>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[11px] text-neutral-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-[#202c4b] dark:text-white">
            {percentage}%
          </span>
        </div>
      </div>

      <button className="mt-3 w-full py-2 text-sm font-medium text-[#3d5ee1] border border-[#3d5ee1]/30 rounded-lg hover:bg-[#eef1fd] dark:hover:bg-[#3d5ee1]/10 transition-colors">
        View All
      </button>
    </div>
  );
};

export default AttendanceWidget;
