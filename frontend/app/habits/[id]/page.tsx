'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAccount, useContractRead } from 'wagmi';
import HabiTracABI from '@/abis/HabiTrac.json';
import Navigation from '@/components/Navigation';
import DeleteHabitButton from '@/components/DeleteHabitButton';

interface Habit {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: bigint;
  isActive: boolean;
}

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = Number(params.id);
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  const { data: userHabits } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'getUserHabits',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const habits = (userHabits as Habit[]) || [];
  const habit = habits.find(h => Number(h.id) === habitId);

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="text-gray-600 dark:text-gray-300">Please connect your wallet</p>
        </main>
      </div>
    );
  }

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
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to Dashboard
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {habit.name}
          </h1>
          {habit.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {habit.description}
            </p>
          )}
          <div className="mt-6">
            <DeleteHabitButton 
              habitId={habit.id} 
              habitName={habit.name}
              onSuccess={() => router.push('/dashboard')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
