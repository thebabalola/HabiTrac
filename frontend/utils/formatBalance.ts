/**
 * Formats a token balance for display
 * @param balance - The balance as a string or number
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted balance string
 */
export function formatBalance(balance: string | number, decimals: number = 2): string {
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  if (isNaN(numBalance)) {
    return '0.00';
  }

  // Format with commas for thousands
  return numBalance.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

