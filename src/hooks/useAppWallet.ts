import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useChainId, useDisconnect } from 'wagmi';

import { ChainId } from '@/config/networks';

export default function useAppWallet() {
  const wagmiChainId = useChainId();
  const { address: ethAddress } = useAccount();
  const { disconnect: disconnectWagmi } = useDisconnect();
  // 内存里的chainId
  // const dispatch = useAppDispatch();

  // const storeChainId = useSelector(selectChainId);
  const [chainId, setChainId] = useState(ChainId.TRON);
  const {
    disconnect: disconnectTron,
    address: tronAddress,
    connected: connectedTron,
  } = useWallet();

  // 当前地址
  const address = useMemo(() => {
    if (connectedTron) {
      return tronAddress;
    }
    return ethAddress;
  }, [connectedTron, ethAddress, tronAddress]);

  useEffect(() => {
    if (ethAddress) {
      setChainId(wagmiChainId);
      return;
    }
    setChainId(ChainId.TRON);
  }, [ethAddress, wagmiChainId]);

  // 断开连接
  const disconnect = useCallback(() => {
    if (chainId === ChainId.TRON) {
      disconnectTron?.();
      return;
    }
    disconnectWagmi?.();
    if (typeof window.okxwallet !== 'undefined') {
      window.okxwallet.disconnect();
    }
  }, [chainId, disconnectTron, disconnectWagmi]);
  // 如果两个都连接，断开全部重新链接
  useEffect(() => {
    if (ethAddress && tronAddress) {
      disconnectTron();
      disconnectWagmi();
    }
  }, [disconnectTron, disconnectWagmi, ethAddress, tronAddress]);

  return { address, chainId, connected: !!address, disconnect };
}
