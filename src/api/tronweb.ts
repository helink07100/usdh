import { ChainId } from '@/config/networks';

import { getProvider } from './providers';

const getSinger = () => {
  return window?.tronWeb;
};
export const getTronWeb = () => {
  return getProvider(ChainId.TRON) as any;
};

const base58ToHex = (address: string) => {
  return getTronWeb()?.address.toHex(address);
};
const hexToBase58 = (address: string) => {
  return getTronWeb()?.address.fromHex(address);
};

const getContactVar = async (
  contractAddress: string,
  functionName: string,
  parameter?: { type: string; value: any }[],
) => {
  // const config = getChainConfig(ChainId.TRON);
  const tx = await getTronWeb()?.transactionBuilder.triggerConstantContract(
    base58ToHex(contractAddress),
    functionName,
    {},
    parameter ?? [],
  );
  return tx.constant_result?.[0];
};

async function setContactVar(
  contractAddress: string,
  functionName: string,
  parameter?: { type: string; value: any }[],
) {
  const functionSelector = functionName;
  const unsignedTx = await getSinger()?.transactionBuilder.triggerSmartContract(
    base58ToHex(contractAddress),
    functionSelector,
    {},
    parameter ?? [],
  );
  const signedTx = await getSinger()?.trx.sign(unsignedTx.transaction, false);
  const result = await getSinger()?.trx.sendRawTransaction(signedTx);
  return result.txid;
}

export { base58ToHex, getContactVar, getSinger, hexToBase58, setContactVar };
