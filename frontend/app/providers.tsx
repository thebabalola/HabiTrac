'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenBalanceProvider } from '@/contexts/TokenBalanceContext';

const { chains, publicClient } = configureChains(
  [base, baseSepolia],
  [publicProvider()]
);

// Use REOWN_ID from environment variable
const projectId = process.env.NEXT_PUBLIC_REOWN_ID || process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const { connectors } = getDefaultWallets({
  appName: 'HabiTrac',
  projectId: projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <TokenBalanceProvider>
            {children}
          </TokenBalanceProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
