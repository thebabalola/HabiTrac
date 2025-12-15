"use client";

import { useAccount, useContractRead } from "wagmi";
import { useRouter } from "next/navigation";
import HabiTracABI from "@/abis/HabiTrac.json";
import LogHabitButton from "./LogHabitButton";

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
  owner: string;
  createdAt: bigint;
  isActive: boolean;
}

interface HabitItemProps {
  readonly habit: Habit;
  readonly onUpdate?: () => void;
}

export default function HabitItem({ habit, onUpdate }: HabitItemProps) {
  const { address } = useAccount();
  const router = useRouter();
  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x0000000000000000000000000000000000000000";

  const { data: streak } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: "getHabitStreak",
    args: address ? [address, BigInt(habit.id)] : undefined,
    enabled: !!address,
    watch: true,
  });

  const { data: totalDays } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: HabiTracABI,
    functionName: "getTotalLoggedDays",
    args: address ? [address, BigInt(habit.id)] : undefined,
    enabled: !!address,
    watch: true,
  });

  const streakDays = Number(streak || 0n);

  const milestones = [7, 30];
  const nextFixedMilestone = milestones.find((m) => streakDays < m);
  const nextMilestone = nextFixedMilestone ?? streakDays + 7;
  const progress = Math.max(0, Math.min(1, streakDays / nextMilestone));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div
          className="flex-1 cursor-pointer"
          onClick={() => router.push(`/habits/${habit.id}`)}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {habit.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="text-gray-600 dark:text-gray-400">
              Streak: <span className="font-semibold text-orange-600 dark:text-orange-400">
                {streakDays} days
              </span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Total:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {Number(totalDays || 0n)} days
              </span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Progress to next milestone ({nextMilestone} days)
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-[width] duration-500 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="sm:flex-shrink-0 sm:pl-6 w-full sm:w-auto">
          <LogHabitButton habitId={habit.id} onSuccess={onUpdate} />
        </div>
      </div>
    </div>
  );
}
