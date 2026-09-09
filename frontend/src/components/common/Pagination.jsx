import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const Pagination = ({
  pageNumber = 0,
  totalPages = 1,
  totalElements = 0,
  pageSize = 10,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = pageNumber * pageSize + 1;
  const endItem = Math.min((pageNumber + 1) * pageSize, totalElements);

  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-50/50 dark:bg-neutral-900 border-t border-neutral-200/80 dark:border-neutral-800 rounded-b-2xl">
      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        Showing{" "}
        <span className="font-bold text-neutral-900 dark:text-white">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-bold text-neutral-900 dark:text-white">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-bold text-neutral-900 dark:text-white">
          {totalElements}
        </span>{" "}
        results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber === 0}
          onClick={() => onPageChange(pageNumber - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        <span className="text-xs text-neutral-600 dark:text-neutral-300 px-2 font-medium">
          Page <span className="font-bold text-neutral-900 dark:text-white">{pageNumber + 1}</span> of{" "}
          <span className="font-bold text-neutral-900 dark:text-white">{totalPages}</span>
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber >= totalPages - 1}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
