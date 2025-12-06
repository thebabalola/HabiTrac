'use client';

import { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import HabiTracABI from '@/abis/HabiTrac.json';

interface DeleteHabitButtonProps {
  habitId: number;
  habitName: string;
  onSuccess?: () => void;
}

export default function DeleteHabitButton({ habitId, habitName, onSuccess }: DeleteHabitButtonProps) {
  const { address } = useAccount();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  const { data, write, isLoading: isPending, error } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'deleteHabit',
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleOpenDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleCloseDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleDelete = async () => {
    if (!address) return;

    try {
      write({
        args: [BigInt(habitId)],
      });
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  if (isSuccess && onSuccess && !showConfirmDialog) {
    onSuccess();
    setShowConfirmDialog(false);
  }

  const isLoading = isPending || isConfirming;

  return (
    <>
      <button
        onClick={handleOpenDialog}
        disabled={isLoading || !address}
        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm hover:shadow-md"
      >
        Delete Habit
      </button>

      {showConfirmDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 
              id="delete-dialog-title"
              className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              Delete Habit
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure? This action cannot be undone.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseDialog}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading || !address}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && !showConfirmDialog && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
          Habit deleted successfully
        </p>
      )}
    </>
  );
}
