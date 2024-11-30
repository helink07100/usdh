import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'ethers';
import { useMemo } from 'react';

import { createCommonMethods } from '@/api/common';
import { TokenSymbol } from '@/config/tokens';
import { useChainConfig } from '@/hooks/useChainConfig';

import useAppWallet from './useAppWallet';

export const useTokenAllowance = (tokenSymbol: TokenSymbol, spender: string) => {
  const { address, chainId } = useAppWallet();
  const chainConfig = useChainConfig();
  const commonMethods = useMemo(() => createCommonMethods(chainId), [chainId]);

  const token = chainConfig.tokenList[tokenSymbol];
  const { data, refetch } = useQuery({
    queryKey: ['allowance', token?.address, spender, address, chainId],
    queryFn: () => commonMethods.queryAllowance(token.address, address!, spender),
    enabled: !!token?.address && !!address && !!spender,
  });

  const allowance = useMemo(
    () => (data && token ? formatUnits(data, token.decimal) : '0'),
    [data, token],
  );

  return { allowance, refetch };
};
