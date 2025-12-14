'use client';

import { useAccount, useContractRead } from 'wagmi';
import HabiTracABI from '@/abis/HabiTrac.json';
import HabitItem from './HabitItem';

interface Habit {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: bigint;
  isActive: boolean;
}

interface HabitListProps {
  readonly onCreateFirstHabit?: () => void;
}

export default function HabitList({ onCreateFirstHabit }: HabitListProps) {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  const { data: userHabits, refetch } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'getUserHabits',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const handleHabitDeleted = () => {
    refetch();
  };

  if (!address) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to view your habits
        </p>
      </div>
    );
  }

  if (!userHabits || (userHabits as Habit[]).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          No habits yet
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Start by creating your first habit. Track your progress and earn rewards as you stay consistent.
        </p>
        <button
          type="button"
          onClick={onCreateFirstHabit}
          disabled={!onCreateFirstHabit}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Your First Habit
        </button>
      </div>
    );
  }

  const activeHabits = (userHabits as Habit[]).filter(h => h.isActive);

  if (activeHabits.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          No active habits
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Reactivate a habit or create a new one to begin tracking your progress and building streaks.
        </p>
        <button
          type="button"
          onClick={onCreateFirstHabit}
          disabled={!onCreateFirstHabit}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Your First Habit
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeHabits.map((habit) => (
        <HabitItem key={Number(habit.id)} habit={habit} onUpdate={handleHabitDeleted} />
      ))}
    </div>
  );
}
