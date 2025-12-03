'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import ChallengeCard from '@/components/ChallengeCard';
import { mockChallenges } from '@/data/mockChallenges';
import { Challenge } from '@/types/challenge';

export default function ChallengesPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    // Simulate loading challenges
    const loadChallenges = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setChallenges(mockChallenges);
      setIsLoading(false);
    };
    
    if (isConnected) {
      loadChallenges();
    }
  }, [isConnected]);

  const handleJoinChallenge = (challengeId: string) => {
    if (joinedChallenges.has(challengeId)) {
      alert('You have already joined this challenge!');
      return;
    }
    
    setJoinedChallenges(prev => new Set(prev).add(challengeId));
    alert(`Successfully joined challenge!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Community Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join community challenges, track your progress, and earn rewards together!
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading challenges...</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No challenges available at the moment.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check back later for new community challenges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoinChallenge}
                isJoined={joinedChallenges.has(challenge.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

