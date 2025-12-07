'use client';

import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import HabiTracABI from '@/abis/HabiTrac.json';
import { useTokenBalanceContext } from '@/contexts/TokenBalanceContext';
import { useTokenEarnings } from '@/hooks/useTokenEarnings';
import { parseTransactionError } from '@/utils/parseTransactionError';
import ErrorMessage from './ErrorMessage';

interface LogHabitButtonProps {
  habitId: number;
  onSuccess?: () => void;
}

export default function LogHabitButton({ habitId, onSuccess }: LogHabitButtonProps) {
  const { address } = useAccount();
  const { refetch: refetchBalance } = useTokenBalanceContext();
  const { awardTokens } = useTokenEarnings();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  const { data, write, isLoading: isPending, error } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: 'logHabit',
  });

  const { isLoading: isConfirming, isSuccess, error: waitError } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleLogHabit = async () => {
    if (!address) return;

    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      write({
        args: [BigInt(habitId), BigInt(currentTimestamp)],
      });
    } catch (err) {
      console.error('Error logging habit:', err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Award tokens when habit is logged successfully (1 token per log)
      awardTokens(1);
      // Refresh token balance
      refetchBalance();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isSuccess, refetchBalance, onSuccess, awardTokens]);

  const isLoading = isPending || isConfirming;

  return (
    <div className="flex flex-col items-end space-y-2">
      <button
        onClick={handleLogHabit}
        disabled={isLoading || !address}
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
      >
        {isLoading ? 'Logging...' : 'Log Today'}
      </button>
      
      {(error || waitError) && (
        <div className="max-w-[200px]">
          <ErrorMessage 
            error={parseTransactionError(error || waitError)} 
            onRetry={handleLogHabit}
          />
        </div>
      )}
      
      {isSuccess && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Logged successfully!
        </p>
      )}
    </div>
  );
}
