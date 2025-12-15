'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { BaseError } from 'viem';

type WalletConnectionStatusProps = Readonly<{
  className?: string;
  showDisconnectedMessage?: boolean;
}>;

export default function WalletConnectionStatus({
  className,
  showDisconnectedMessage = true,
}: WalletConnectionStatusProps) {
  const { isConnected, address, isConnecting } = useAccount();
  const { error, isLoading } = useConnect();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const errorMessage =
    error instanceof BaseError
      ? error.shortMessage
      : (error as any)?.message ?? String(error);

  const isLoadingState = isConnecting || isLoading;

  const containerClassName = ['space-y-4', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName}>
      <div className="flex justify-center">
        <ConnectButton />
      </div>

      {isLoadingState && (
        <output
          aria-live="polite"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
        >
          <span
            aria-hidden
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
          />
          <span>Connecting to wallet…</span>
        </output>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
          Connection failed: {errorMessage}
        </div>
      )}

      {!isLoadingState && !error && !isConnected && showDisconnectedMessage && (
        <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-800 dark:bg-slate-900/30 dark:text-slate-200">
          No wallet connected. Use the button above to connect.
        </div>
      )}

      {isConnected && truncatedAddress && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-200">
          ✅ Wallet connected — {truncatedAddress}
        </div>
      )}
    </div>
  );
}
