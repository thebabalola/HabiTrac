'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

interface TokenBalanceContextType {
  balance: string;
  isLoading: boolean;
  refetch: () => void;
  updateBalance: (newBalance: string) => void;
}

const TokenBalanceContext = createContext<TokenBalanceContextType | undefined>(undefined);

export function TokenBalanceProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    if (!isConnected || !address) {
      setBalance('0');
      return;
    }

    setIsLoading(true);
    // Mock token balance - will be replaced with actual contract call
    await new Promise(resolve => setTimeout(resolve, 500));
    setBalance('0');
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBalance();
  }, [address, isConnected]);

  const updateBalance = (newBalance: string) => {
    setBalance(newBalance);
  };

  return (
    <TokenBalanceContext.Provider value={{ balance, isLoading, refetch: fetchBalance, updateBalance }}>
      {children}
    </TokenBalanceContext.Provider>
  );
}

export function useTokenBalanceContext() {
  const context = useContext(TokenBalanceContext);
  if (context === undefined) {
    throw new Error('useTokenBalanceContext must be used within a TokenBalanceProvider');
  }
  return context;
}

