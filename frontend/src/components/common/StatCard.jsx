import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = "gray",
  subtitle,
}) => {
  const colorStyles = {
    dark: {
      bg: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white",
    },
    medium: {
      bg: "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600",
    },
    light: {
      bg: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
    },
    gray: {
      bg: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
    },
    indigo: {
      bg: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white",
    },
    emerald: {
      bg: "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600",
    },
    amber: {
      bg: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
    },
    sky: {
      bg: "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600",
    },
    violet: {
      bg: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white",
    },
    rose: {
      bg: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.gray;

  return (
    <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            {value ?? "—"}
          </h3>
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-lg border ${currentStyle.bg} transition-transform`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-xs">
          {trend && (
            <span className="font-semibold px-2 py-0.5 rounded-md text-[11px] bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
              {trend}
            </span>
          )}
          {trendLabel && (
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">
              {trendLabel}
            </span>
          )}
          {subtitle && (
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
