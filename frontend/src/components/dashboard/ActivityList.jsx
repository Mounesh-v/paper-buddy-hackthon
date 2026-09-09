import React from "react";
import Button from "../common/Button";

const ActivityList = ({
  title,
  viewAllLabel = "View All",
  onViewAll,
  emptyMessage = "No items found.",
  items = [],
  renderItem,
}) => {
  return (
    <div className="card-panel p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#202c4b] dark:text-white">
          {title}
        </h3>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            {viewAllLabel}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-neutral-400 py-8 text-center flex-1">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-2 flex-1">
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </div>
  );
};

export default ActivityList;
