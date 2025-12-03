'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import HabitList from '@/components/HabitList';
import CreateHabitForm from '@/components/CreateHabitForm';

export default function Dashboard() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Habits
          </h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Create Habit'}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreateHabitForm onSuccess={() => setShowCreateForm(false)} />
          </div>
        )}

        <HabitList />
      </main>
    </div>
  );
}

