import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'ethers';
import { useMemo } from 'react';

import { createCommonMethods } from '@/api/common';
import useAppWallet from '@/hooks/useAppWallet';
import { useChainConfig } from '@/hooks/useChainConfig';
import { formatNumber, toLowerCaseEquals } from '@/utils';

interface TokenBalance {
  key: string;
  address: string;
  currency: string;
  balance: string;
}

export const useTokenBalances = (tokenAddresses: string[], walletAddress?: string | null) => {
  const { chainId } = useAppWallet();
  const chainConfig = useChainConfig();
  const commonMethods = useMemo(() => createCommonMethods(chainId), [chainId]);

  const { data, refetch } = useQuery({
    queryKey: ['tokenBalances', walletAddress, chainId, tokenAddresses],
    queryFn: () => commonMethods.getTokenBalances(tokenAddresses, walletAddress!),
    enabled: !!walletAddress && tokenAddresses?.length > 0,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const balances = useMemo<TokenBalance[]>(() => {
    if (!data) return [];

    return data.map((balance: bigint, index: number) => {
      const token = Object.values(chainConfig.tokenList).find((t) =>
        toLowerCaseEquals(t.address, tokenAddresses[index]),
      );
      if (!token) return balance;

      return {
        key: token.name,
        address: token.address,
        currency: token.name,
        balance: formatNumber(formatUnits(balance, token.decimal), 6),
      };
    });
  }, [chainConfig.tokenList, data, tokenAddresses]);
  return { data: balances, refetch };
};
