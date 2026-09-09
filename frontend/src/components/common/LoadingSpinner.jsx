import React from "react";

const LoadingSpinner = ({ label = "Loading data...", fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-3 border-neutral-300 dark:border-neutral-700"></div>
        <div className="absolute inset-0 rounded-full border-3 border-black dark:border-white border-t-transparent animate-spin"></div>
      </div>
      {label && (
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
