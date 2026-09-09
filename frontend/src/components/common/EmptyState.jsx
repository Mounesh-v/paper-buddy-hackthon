import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  title = "No records found",
  description = "There are no items matching your criteria at this time.",
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-neutral-900 dark:text-white">
        {title}
      </h4>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mt-1 mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
