'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface DeleteHabitButtonProps {
  habitId: number;
  habitName: string;
  onSuccess?: () => void;
}

export default function DeleteHabitButton({ habitId, habitName, onSuccess }: DeleteHabitButtonProps) {
  const { address } = useAccount();

  return (
    <button
      disabled={!address}
      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
    >
      Delete Habit
    </button>
  );
}
