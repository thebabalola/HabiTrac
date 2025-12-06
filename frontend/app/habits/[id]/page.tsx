'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const { isConnected } = useAccount();
  const router = useRouter();

  if (!isConnected) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Habit Details
        </h1>
      </main>
    </div>
  );
}

