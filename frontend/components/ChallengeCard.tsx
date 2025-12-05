'use client';

import { Challenge } from '@/types/challenge';

interface ChallengeCardProps {
  readonly challenge: Challenge;
  readonly onJoin: (challengeId: string) => void;
  readonly isJoined?: boolean;
}

export default function ChallengeCard({ challenge, onJoin, isJoined = false }: ChallengeCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {challenge.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {challenge.reward && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
            🎁 Reward: {challenge.reward}
          </p>
        </div>
      )}

      <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        <p>📅 {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</p>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">
              {challenge.participants} {challenge.maxParticipants ? `/${challenge.maxParticipants}` : ''} participants
            </span>
          </span>
        </div>
        {challenge.maxParticipants && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((challenge.participants / challenge.maxParticipants) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onJoin(challenge.id)}
          disabled={isJoined}
          className={`w-full sm:w-auto font-semibold py-2.5 px-4 rounded-lg transition-colors ${
            isJoined
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isJoined ? 'Joined' : 'Join Challenge'}
        </button>
      </div>
    </div>
  );
}

