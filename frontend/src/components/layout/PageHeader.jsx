import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-[#202c4b] dark:text-white">
          {title}
        </h1>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-[#3d5ee1] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {subtitle && !breadcrumbs.length && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
