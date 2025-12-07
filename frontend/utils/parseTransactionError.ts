/**
 * Parses blockchain transaction errors and returns user-friendly messages
 */

export interface ParsedError {
  message: string;
  type: 'user_rejection' | 'insufficient_gas' | 'network_error' | 'contract_error' | 'unknown';
  actionable: boolean;
  actionText?: string;
}

export function parseTransactionError(error: any): ParsedError {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      type: 'unknown',
      actionable: false,
    };
  }

  const errorMessage = error.message || error.toString() || '';
  const errorCode = error.code || error.error?.code;

  // User rejected the transaction
  if (
    errorCode === 4001 ||
    errorCode === 'ACTION_REJECTED' ||
    errorMessage.toLowerCase().includes('user rejected') ||
    errorMessage.toLowerCase().includes('user denied') ||
    errorMessage.toLowerCase().includes('rejected the request')
  ) {
    return {
      message: 'Transaction was cancelled. You can try again when ready.',
      type: 'user_rejection',
      actionable: true,
      actionText: 'Try Again',
    };
  }

  // Insufficient gas
  if (
    errorCode === -32000 ||
    errorCode === -32603 ||
    errorMessage.toLowerCase().includes('insufficient funds') ||
    errorMessage.toLowerCase().includes('insufficient balance') ||
    errorMessage.toLowerCase().includes('gas required exceeds') ||
    errorMessage.toLowerCase().includes('out of gas') ||
    errorMessage.toLowerCase().includes('gas price too low')
  ) {
    return {
      message: 'Insufficient gas to complete transaction. Please add more ETH to your wallet or increase gas limit.',
      type: 'insufficient_gas',
      actionable: true,
      actionText: 'Add Funds',
    };
  }

  // Network errors
  if (
    errorCode === 'NETWORK_ERROR' ||
    errorCode === 'NETWORK_ERROR' ||
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('connection') ||
    errorMessage.toLowerCase().includes('timeout') ||
    errorMessage.toLowerCase().includes('fetch failed') ||
    errorMessage.toLowerCase().includes('network request failed')
  ) {
    return {
      message: 'Network connection error. Please check your internet connection and try again.',
      type: 'network_error',
      actionable: true,
      actionText: 'Retry',
    };
  }

  // Contract revert errors
  if (
    errorMessage.toLowerCase().includes('revert') ||
    errorMessage.toLowerCase().includes('execution reverted') ||
    errorMessage.toLowerCase().includes('habit does not exist') ||
    errorMessage.toLowerCase().includes('not the habit owner') ||
    errorMessage.toLowerCase().includes('habit already logged')
  ) {
    // Try to extract the revert reason
    let userMessage = 'Transaction failed';
    
    if (errorMessage.toLowerCase().includes('habit does not exist')) {
      userMessage = 'This habit does not exist. Please refresh the page.';
    } else if (errorMessage.toLowerCase().includes('not the habit owner')) {
      userMessage = 'You are not the owner of this habit.';
    } else if (errorMessage.toLowerCase().includes('habit already logged')) {
      userMessage = 'This habit has already been logged for today.';
    } else {
      const revertMatch = errorMessage.match(/revert\s+(.+)/i) || errorMessage.match(/reason:\s*(.+)/i);
      if (revertMatch) {
        userMessage = `Transaction failed: ${revertMatch[1]}`;
      }
    }
    
    return {
      message: userMessage,
      type: 'contract_error',
      actionable: false,
    };
  }

  // Default: return a cleaned up version of the error
  return {
    message: errorMessage.length > 100 
      ? 'Transaction failed. Please try again or contact support if the issue persists.'
      : errorMessage,
    type: 'unknown',
    actionable: true,
    actionText: 'Try Again',
  };
}

