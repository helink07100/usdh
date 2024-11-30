import { getConnectorClient } from '@wagmi/core';
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { Client } from 'viem';

import { ChainId, getChainConfig } from '../config/networks'; // Adjust the import path as needed
import { config } from '../wagmi';

export function getProvider(chainId: ChainId) {
  const network = getChainConfig(chainId);
  if (network.chainId === ChainId.TRON) {
    // return new TronWeb({
    //   fullHost: network.rpc,
    //   headers: { 'TRON-PRO-API-KEY': network.gridApiKey },
    //   privateKey: '01',
    // });
    return window?.tronWeb;
  }
  return new JsonRpcProvider(network.rpc);
}

export function walletClientToSigner(walletClient: Client) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account!.address);
  return signer;
}

export async function getEthereumSigner() {
  const client = await getConnectorClient(config as any);
  if (!client) return undefined;

  return walletClientToSigner(client);
}
declare global {
  interface Window {
    tronWeb: any;
    tronLink: any;
    okxwallet: any;
  }
}
