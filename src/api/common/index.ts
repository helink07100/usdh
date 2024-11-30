import { ChainId } from '@/config/networks';

import { EthereumCommonService } from './EthereumCommonService';
import { TronCommonService } from './TronCommonService';
import { ICommonService } from './types';

const createCommonService = (chainId: ChainId): ICommonService => {
  switch (chainId) {
    case ChainId.TRON:
      return new TronCommonService(chainId);
    default:
      return new EthereumCommonService(chainId);
  }
};

export const createCommonMethods = (chainId: ChainId) => {
  const service = createCommonService(chainId);
  return {
    queryAllowance: (token: string, owner: string, spender: string) =>
      service.queryAllowance(token, owner, spender),
    setApprove: (token: string, spender: string, amount: string) =>
      service.setApprove(token, spender, amount),
    getTokenBalances: (tokenAddress: string[], account: string) =>
      service.getTokenBalances(tokenAddress, account),
    getCurrentBlockNumber: () => service.getCurrentBlockNumber(),
    getTimestampByBlockNumber: (blockNumber: number) =>
      service.getTimestampByBlockNumber(blockNumber),
    getTransactionById: (txId: string) => service.getTransactionById(txId),
    isAdmin: (address: string) => service.isAdmin(address),
    // isOperator: (address: string) => service.isOperator(address),
    // isFinancial: (address: string) => service.isFinancial(address),
    confirmTransaction: (id: number) => service.confirmTransaction(id),
    isAddress: (address: string) => service.isAddress(address),
    getOwner: () => service.getOwner(),
    sendTransaction: (value: string, data: string, to: string) =>
      service.sendTransaction(value, data, to),
  };
};
