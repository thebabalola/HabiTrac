'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { useMemo } from 'react';
import { BaseError } from 'viem';

export default function WalletConnectionStatus() {
  const { isConnected, address, isConnecting } = useAccount();
  const { error, isLoading } = useConnect();

  const truncatedAddress = useMemo(() => {
    if (!address) return null;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ConnectButton />
      </div>

      {(isConnecting || isLoading) && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
        >
          <span
            aria-hidden
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
          />
          <span>Connecting to wallet…</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
          Connection failed: {error instanceof BaseError ? error.shortMessage : error.message}
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
