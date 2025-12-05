'use client';

import { useAccount, useContractRead } from 'wagmi';
import HabiTracABI from '@/abis/HabiTrac.json';
import LogHabitButton from './LogHabitButton';

interface Habit {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: bigint;
  isActive: boolean;
}

interface HabitItemProps {
  readonly habit: Habit;
  readonly onUpdate?: () => void;
}

export default function HabitItem({ habit, onUpdate }: HabitItemProps) {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  const { data: streak } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'getHabitStreak',
    args: address ? [address, BigInt(habit.id)] : undefined,
    enabled: !!address,
    watch: true,
  });

  const { data: totalDays } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'getTotalLoggedDays',
    args: address ? [address, BigInt(habit.id)] : undefined,
    enabled: !!address,
    watch: true,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {habit.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Streak: <span className="font-semibold text-orange-600 dark:text-orange-400">
                {Number(streak || 0n)} days
              </span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Total: <span className="font-semibold text-blue-600 dark:text-blue-400">
                {Number(totalDays || 0n)} days
              </span>
            </span>
          </div>
        </div>
        <div className="sm:flex-shrink-0 sm:pl-6 w-full sm:w-auto">
          <LogHabitButton habitId={habit.id} onSuccess={onUpdate} />
        </div>
      </div>
    </div>
  );
}
