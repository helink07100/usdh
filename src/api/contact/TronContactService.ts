import { ChainId } from '@/config/networks';
import { decodeABI, decodeParams } from '@/utils';

import { base58ToHex, getContactVar, getTronWeb } from '../tronweb';

import { IContactService } from './types';
// import { decodeParams } from 'tronweb/utils';

export class TronContactService implements IContactService {
  // private chainId: ChainId;

  constructor(chainId: ChainId) {
    console.log('🚀 ~ TronContactService ~ constructor ~ chainId:', chainId);
    // this.chainId = chainId;
  }

  async getTransaction(transactionId: number, multiSigWallet: string): Promise<any> {
    const tx = await getTronWeb()?.transactionBuilder.triggerConstantContract(
      base58ToHex(multiSigWallet),
      'getTransaction(uint256)',
      {},
      [{ type: 'uint256', value: Number(transactionId) }],
    );

    const value = tx.constant_result?.[0].slice(64);
    const result = await decodeParams(
      ['address', 'uint256', 'bytes', 'bool', 'uint256', 'address', 'uint256', 'uint256'],
      `0x${value}`,
      true,
    );
    return {
      destination: result[0],
      value: result[1],
      data: result[2],
      executed: result[3],
      numberConfirm: result[4],
      initiator: result[5],
      initTime: result[6],
      executeTime: result[7],
    };
  }

  async getTransactionId(multiSigWallet: string): Promise<number> {
    const value = await getContactVar(multiSigWallet, 'getTransactionId()', []);
    return decodeABI(value, ['uint256'])?.[0];
  }

  async getRequired(multiSigWallet: string): Promise<number> {
    const value = await getContactVar(multiSigWallet, 'getRequired()', []);
    return decodeABI(value, ['uint256'])?.[0];
  }
}
