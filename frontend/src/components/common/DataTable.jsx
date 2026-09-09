import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  error = null,
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  emptyActionLabel,
  pageResponse,
  onPageChange,
  onRowClick,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200/80 dark:border-neutral-800 p-12 shadow-sm">
        <LoadingSpinner label="Retrieving live records from backend server..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-neutral-50/90 dark:bg-neutral-800/60 text-[11px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200/80 dark:border-neutral-800">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3.5 ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-700 dark:text-neutral-200 font-medium">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors duration-150 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : (row[col.accessorKey] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageResponse && onPageChange && (
        <Pagination
          pageNumber={pageResponse.pageNumber}
          totalPages={pageResponse.totalPages}
          totalElements={pageResponse.totalElements}
          pageSize={pageResponse.pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
