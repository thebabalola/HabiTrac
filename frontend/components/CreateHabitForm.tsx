'use client';

import { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import HabiTracABI from '@/abis/HabiTrac.json';
import { parseTransactionError } from '@/utils/parseTransactionError';
import ErrorMessage from './ErrorMessage';

interface CreateHabitFormProps {
  onSuccess?: () => void;
}

export default function CreateHabitForm({ onSuccess }: CreateHabitFormProps) {
  const { address } = useAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  const { data, write, isLoading: isPending, error } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'createHabit',
  });

  const { isLoading: isConfirming, isSuccess, error: waitError } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !name.trim()) return;

    try {
      write({
        args: [name, description],
      });
    } catch (err) {
      console.error('Error creating habit:', err);
    }
  };

  if (isSuccess) {
    setName('');
    setDescription('');
    if (onSuccess) {
      setTimeout(() => onSuccess(), 1000);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Create New Habit
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Run 5km daily"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Describe your habit..."
          />
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {(error || waitError) && (
          <ErrorMessage 
            error={parseTransactionError(error || waitError)} 
            onRetry={handleSubmit}
          />
        )}

        <button
          type="submit"
          disabled={isPending || isConfirming || !name.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {isPending || isConfirming ? 'Creating...' : 'Create Habit'}
        </button>

        {isSuccess && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              Habit created successfully!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
