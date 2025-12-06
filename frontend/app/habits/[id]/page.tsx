'use client';

import { useAccount, useContractRead } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import DeleteHabitButton from '@/components/DeleteHabitButton';
import HabiTracABI from '@/abis/HabiTrac.json';

interface Habit {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: bigint;
  isActive: boolean;
}

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
  const habitId = parseInt(params.id);

  const { data: userHabits, refetch } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'getUserHabits',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  if (!isConnected) {
    router.push('/');
    return null;
  }

  const habits = (userHabits as Habit[]) || [];
  const habit = habits.find(h => Number(h.id) === habitId);

  if (!habit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="text-gray-600 dark:text-gray-300">Habit not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            {habit.name}
          </h1>
          <DeleteHabitButton 
            habitId={habit.id} 
            habitName={habit.name}
            onSuccess={() => {
              router.push('/dashboard');
            }}
          />
        </div>
        {habit.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {habit.description}
          </p>
        )}
      </main>
    </div>
  );
}

