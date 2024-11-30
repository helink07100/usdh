import { isAddress } from 'tronweb/utils';

import { ChainId, getChainConfig } from '@/config/networks';
import { MAIN_COIN } from '@/config/tokens';
import { decodeABI, decodeParams } from '@/utils';

import { getProvider } from '../providers';
import { base58ToHex, getContactVar, setContactVar } from '../tronweb';

import { ICommonService } from './types';

export class TronCommonService implements ICommonService {
  private chainId: ChainId;

  constructor(chainId: ChainId) {
    this.chainId = chainId;
  }

  async getOwner(): Promise<string> {
    const { config } = this.getProviderAndConfig();
    const value = await getContactVar(config.USDH, 'owner()', []);
    const result = await decodeParams(['address'], `0x${value}`, true);
    return result?.[0];
  }

  async confirmTransaction(id: number): Promise<any> {
    const parameter = [{ type: 'uint256', value: id }];
    const multiSigWallet = await this.getOwner();
    return setContactVar(base58ToHex(multiSigWallet), 'confirmTransaction(uint256)', parameter);
  }

  async isAdmin(address: string): Promise<boolean> {
    const multiSigWallet = await this.getOwner();
    const value = await getContactVar(base58ToHex(multiSigWallet), 'checkOwner(address)', [
      { type: 'address', value: base58ToHex(address) },
    ]);
    return decodeABI(value, ['bool'])?.[0];
  }

  async sendTransaction(value: string, data: string, to: string): Promise<any> {
    const parameter = [
      { type: 'address', value: to },
      { type: 'uint256', value },
      { type: 'bytes', value: data },
    ];
    const multiSigWallet = await this.getOwner();
    return setContactVar(
      base58ToHex(multiSigWallet),
      'submitTransaction(address,uint256,bytes)',
      parameter,
    );
  }

  private getConfig() {
    return getChainConfig(this.chainId);
  }

  private getProviderAndConfig() {
    const config = this.getConfig();
    const provider = getProvider(this.chainId) as any;
    return { provider, config };
  }

  async queryAllowance(token: string, owner: string, spender: string) {
    const parameter = [
      { type: 'address', value: base58ToHex(owner) },
      { type: 'address', value: base58ToHex(spender) },
    ];
    const value = await getContactVar(token, 'allowance(address,address)', parameter);
    return decodeABI(value, ['uint256'])?.[0];
  }

  async setApprove(token: string, spender: string, amount: string) {
    const parameter = [
      { type: 'address', value: base58ToHex(spender) },
      { type: 'uint256', value: amount },
    ];
    return setContactVar(token, 'approve(address,uint256)', parameter);
  }

  async getTokenBalances(tokenAddress: string[], account: string) {
    const parameter = [
      {
        type: 'address[]',
        value: [base58ToHex(account)],
      },
      {
        type: 'address[]',
        value: tokenAddress.map((t) =>
          t === MAIN_COIN ? '0x0000000000000000000000000000000000000000' : base58ToHex(t),
        ),
      },
    ];
    const { config } = this.getProviderAndConfig();
    const value = await getContactVar(config.multicall, 'balances(address[],address[])', parameter);

    return decodeABI(value, ['uint256[]'])?.[0];
  }

  async getCurrentBlockNumber() {
    const { provider } = this.getProviderAndConfig();
    const block = await provider?.trx?.getCurrentBlock();
    return block.block_header?.raw_data?.number;
  }

  async getTimestampByBlockNumber(blockNumber: number): Promise<number> {
    const { provider } = this.getProviderAndConfig();
    const block = await provider?.trx.getBlockByNumber(blockNumber);
    return block?.block_header?.raw_data?.timestamp;
  }

  async getTransactionById(txId: string): Promise<any> {
    const { provider } = this.getProviderAndConfig();
    const tx = await provider?.trx.getUnconfirmedTransactionInfo(txId);
    let status = -1;
    if (tx.contract_address) {
      const success = tx.receipt.result === 'SUCCESS';
      status = success ? 1 : 0;
      return { ...tx, status };
    }
    if (Object.keys(tx).length > 2) {
      status = 1;
    }
    return { ...tx, status };
  }

  isAddress(address: string): boolean {
    return isAddress(address);
  }
}
