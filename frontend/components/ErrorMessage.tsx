'use client';

import { ParsedError } from '@/utils/parseTransactionError';

interface ErrorMessageProps {
  error: ParsedError | null;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ error, onRetry, className = '' }: ErrorMessageProps) {
  if (!error) return null;

  const getIcon = () => {
    switch (error.type) {
      case 'user_rejection':
        return '⚠️';
      case 'insufficient_gas':
        return '⛽';
      case 'network_error':
        return '🌐';
      case 'contract_error':
        return '❌';
      default:
        return '⚠️';
    }
  };

  return (
    <div className={`p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{getIcon()}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
            {error.message}
          </p>
          {error.actionable && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 underline"
            >
              {error.actionText || 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

