import React from "react";

const trendColors = {
  up: "bg-red-50 text-red-500 border-red-100",
  down: "bg-green-50 text-green-600 border-green-100",
  neutral: "bg-blue-50 text-blue-600 border-blue-100",
};

const iconColors = {
  blue: "bg-blue-50 text-blue-500",
  green: "bg-green-50 text-green-500",
  orange: "bg-orange-50 text-orange-500",
  purple: "bg-purple-50 text-purple-500",
  red: "bg-red-50 text-red-500",
  cyan: "bg-cyan-50 text-cyan-500",
};

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  active,
  inactive,
  iconColor = "blue",
}) => {
  return (
    <div className="card-panel p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-2xl font-bold text-[#202c4b] dark:text-white">
              {value ?? "—"}
            </h3>
            {trend && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${trendColors[trendDirection]}`}
              >
                {trend}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {title}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconColors[iconColor]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(active !== undefined || inactive !== undefined) && (
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-neutral-500">Active</span>
            <span className="font-bold text-[#202c4b] dark:text-white">
              {active ?? 0}
            </span>
          </div>
          <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-neutral-500">Inactive</span>
            <span className="font-bold text-[#202c4b] dark:text-white">
              {inactive ?? 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStatCard;
