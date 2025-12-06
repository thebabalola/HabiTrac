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

export default function HabitList() {
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
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You don't have any habits yet. Create your first habit to get started!
        </p>
      </div>
    );
  }

  const activeHabits = (userHabits as Habit[]).filter(h => h.isActive);

  if (activeHabits.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You don't have any active habits. Create your first habit to get started!
        </p>
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
