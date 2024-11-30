import { Contract, Interface, isAddress, JsonRpcProvider } from 'ethers';

import { ChainId, getChainConfig } from '@/config/networks';
import { MAIN_COIN } from '@/config/tokens';

import { ERC20_ABI, HoneUsd_ABI, Multicall2, MultiSigWallet_ABI } from '../abi';
import { getEthereumSigner, getProvider } from '../providers';

import { createCommonMethods } from '.';
import { ICommonService } from './types';

export class EthereumCommonService implements ICommonService {
  private chainId: ChainId;

  constructor(chainId: ChainId) {
    this.chainId = chainId;
  }

  async getOwner(): Promise<string> {
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    const config = getChainConfig(this.chainId);
    const usdh = new Contract(config.USDH, HoneUsd_ABI, provider);
    return usdh.owner();
  }

  async confirmTransaction(id: number): Promise<any> {
    const signer = await getEthereumSigner();
    const multiSigWallet = await createCommonMethods(this.chainId).getOwner();
    const multiSig = new Contract(multiSigWallet, MultiSigWallet_ABI, signer);
    const transaction = await multiSig.confirmTransaction(id);
    return transaction.hash;
  }

  async sendTransaction(value: string, data: string, to: string): Promise<any> {
    const signer = await getEthereumSigner();
    const multiSigWallet = await createCommonMethods(this.chainId).getOwner();
    const multiSig = new Contract(multiSigWallet, MultiSigWallet_ABI, signer);
    const transaction = await multiSig.submitTransaction(to, value, data);
    return transaction.hash;
  }

  async getTimestampByBlockNumber(blockNumber: number): Promise<number> {
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    const block = await provider.getBlock(blockNumber);
    return block?.timestamp || 0;
  }

  // private getConfig() {
  //   return getChainConfig(this.chainId);
  // }

  async queryAllowance(token: string, owner: string, spender: string) {
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    const tokenContract = new Contract(token, ERC20_ABI, provider);
    return tokenContract.allowance(owner, spender);
  }

  async setApprove(token: string, spender: string, amount: string) {
    const signer = await getEthereumSigner();
    const tokenContract = new Contract(token, ERC20_ABI, signer);
    const transaction = await tokenContract.approve(spender, amount);
    return transaction.hash;
  }

  getTokenBalances = async (tokenAddress: string[], account: string) => {
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    const config = getChainConfig(this.chainId);
    const multicallContract = new Contract(config.multicall, Multicall2, provider);
    const balanceAbi = ['function balanceOf(address) returns (uint)'];
    const tokenIface = new Interface(balanceAbi);
    // const mainFragment = multicallContract?.interface.getFunction('getEthBalance');
    const calls = tokenAddress.map((address) => {
      if (address === MAIN_COIN) {
        return {
          address: config.multicall,
          callData: multicallContract.interface.encodeFunctionData('getEthBalance', [account]),
        };
      }
      return {
        address,
        callData: tokenIface.encodeFunctionData('balanceOf', [account]),
      };
    });
    const [, returnData] = await multicallContract.aggregate(
      calls.map((obj) => [obj.address, obj.callData]),
    );
    const balances = returnData.map((result: any) =>
      tokenIface.decodeFunctionResult('balanceOf', result).toString(),
    );
    return balances;
  };

  async getCurrentBlockNumber() {
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    return provider.getBlockNumber();
  }

  async getTransactionById(txId: string) {
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    const receipt = await provider.getTransactionReceipt(txId);

    return receipt;
  }

  async isAdmin(address: string): Promise<boolean> {
    const provider = getProvider(this.chainId) as JsonRpcProvider;
    const multiSigWallet = await createCommonMethods(this.chainId).getOwner();
    const controller = new Contract(multiSigWallet, MultiSigWallet_ABI, provider);
    const admin = await controller.checkOwner(address);
    return admin;
  }

  // async isOperator(address: string): Promise<boolean> {
  //   const provider = getProvider(this.chainId) as JsonRpcProvider;
  //   const config = getChainConfig(this.chainId);
  //   const controller = new Contract(config.controllerContact, CONTROLLER_ABI, provider);
  //   return controller.isOperator(address);
  // }

  // async isFinancial(address: string): Promise<boolean> {
  //   const provider = getProvider(this.chainId) as JsonRpcProvider;
  //   const config = getChainConfig(this.chainId);
  //   const controller = new Contract(config.controllerContact, CONTROLLER_ABI, provider);
  //   return controller.isFinancial(address);
  // }

  isAddress(address: string): boolean {
    return isAddress(address);
  }
}
