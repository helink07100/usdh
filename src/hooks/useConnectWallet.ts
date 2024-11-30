import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useConnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

import { WalletType } from '@/config/constant';

export default function useConnectWallet() {
  const { connected, wallets, wallet, select, connect } = useWallet();

  const { connect: connectWagmi } = useConnect();
  const connectTronWallet = () => {
    if (connected) {
      return;
    }
    if (!wallets || wallets.length === 0) {
      return;
    }
    try {
      if (!wallet) {
        select(wallets?.[0].adapter.name);
      } else {
        connect();
      }
    } catch (error) {
      // message.warning(error as string);
    }
  };
  const connectWallet = async (walletType: WalletType) => {
    if (walletType === WalletType.OKX) {
      window.okxwallet.request({
        method: 'eth_requestAccounts',
      });
    }
    if (walletType === WalletType.MetaMask) {
      connectWagmi({ connector: metaMask() });
    }
    if (walletType === WalletType.TronLink) {
      connectTronWallet();
    }
  };

  return connectWallet;
}
