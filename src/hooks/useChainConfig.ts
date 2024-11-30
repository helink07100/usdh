import { useMemo } from 'react';

import { ChainConfig, getChainConfig } from '@/config/networks';

import useAppWallet from './useAppWallet';

export function useChainConfig(): ChainConfig {
  const { chainId } = useAppWallet();
  return useMemo(() => {
    return getChainConfig(chainId);
  }, [chainId]);
}
