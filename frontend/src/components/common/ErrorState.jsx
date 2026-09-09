import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Unable to load data',
  message = 'An unexpected error occurred while communicating with the backend API.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 my-4">
      <div className="p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm" icon={RotateCcw}>
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
