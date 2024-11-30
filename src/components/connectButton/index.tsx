import { ConnectButton } from '@ant-design/web3';
import { App } from 'antd';
import { useEffect, useState } from 'react';
import { usePrevious } from 'react-use';
import { tron } from 'viem/chains';

import { ChainId } from '@/config/networks';
import useAppWallet from '@/hooks/useAppWallet';
import { useLoginStateContext } from '@/pages/sys/login/providers/LoginStateProvider';
import { useUserActions, useUserToken } from '@/store/userStore';
import { getChain } from '@/utils';

export default function ConnectedButton() {
  const { address, connected, disconnect, chainId } = useAppWallet();
  console.log('🚀 ~ ConnectedButton ~ address:', address);
  const [addr, setAddr] = useState(address);
  const previous = usePrevious(addr);

  const { clearUserInfoAndToken } = useUserActions();
  const { accessToken } = useUserToken();
  const { backToLogin } = useLoginStateContext();
  const { message } = App.useApp();
  // 钱包卸载
  useEffect(() => {
    if (!address && !addr) {
      clearUserInfoAndToken();
      backToLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, accessToken]);

  // 切换地址
  useEffect(() => {
    if (connected && accessToken && address && previous) {
      setAddr(null);
      disconnect();
      clearUserInfoAndToken();
      message.info('切换钱包地址请重新登录');
      backToLogin();
    }
    setAddr(addr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, accessToken]);

  if (!address) {
    return null;
  }
  return (
    <ConnectButton
      locale={{ copyAddress: '复制地址', disconnect: '退出登录' }}
      chain={chainId === ChainId.TRON ? tron : getChain(chainId)}
      size="large"
      // icon={
      //   <Image src={wallet?.adapter.icon} alt="wallet" width={24} height={24} preview={false} />
      // }
      account={{
        address,
      }}
      addressPrefix={false}
      onDisconnectClick={() => {
        clearUserInfoAndToken();
        backToLogin();
        disconnect();
      }}
    />
  );
}
