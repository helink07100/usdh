import { Contract, JsonRpcProvider } from 'ethers';

import { ChainId, getChainConfig } from '@/config/networks';

import { MultiSigWallet_ABI } from '../abi';
import { getProvider } from '../providers';

import { IContactService } from './types';

export class EthereumContactService implements IContactService {
  private chainId: ChainId;

  constructor(chainId: ChainId) {
    this.chainId = chainId;
  }

  private getConfig() {
    return getChainConfig(this.chainId);
  }

  private getProviderAndConfig() {
    const config = this.getConfig();
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    return { provider, config };
  }

  // 根据交易ID返回交易详情
  async getTransaction(transactionId: number, multiSigWallet: string): Promise<any> {
    const { provider } = this.getProviderAndConfig();
    const market = new Contract(multiSigWallet, MultiSigWallet_ABI, provider);
    return market.getTransaction(transactionId);
  }

  // 返回当前最新的交易ID
  async getTransactionId(multiSigWallet: string): Promise<any> {
    const { provider } = this.getProviderAndConfig();
    const market = new Contract(multiSigWallet, MultiSigWallet_ABI, provider);
    return market.getTransactionId();
  }

  // 返回执行合约需要多签最小数量
  async getRequired(multiSigWallet: string): Promise<any> {
    const { provider } = this.getProviderAndConfig();
    const market = new Contract(multiSigWallet, MultiSigWallet_ABI, provider);
    return market.getRequired();
  }
}
