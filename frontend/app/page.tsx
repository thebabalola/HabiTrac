'use client';

import WalletConnectionStatus from '@/components/WalletConnectionStatus';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full text-center space-y-8 sm:space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            HabiTrac
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Track your habits on-chain and earn rewards for consistency
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
            Get Started
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallet to start tracking your habits on the blockchain
          </p>
          
          <WalletConnectionStatus />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6 shadow-lg">
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
              📝 Track Habits
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Log your daily habits on-chain with immutable records
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6 shadow-lg">
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
              🔥 Build Streaks
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Maintain consistency and watch your streaks grow
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6 shadow-lg">
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
              🎁 Earn Rewards
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get rewarded with tokens for your dedication
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

