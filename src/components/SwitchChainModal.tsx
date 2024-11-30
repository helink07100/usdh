import { Button } from 'antd';
import { useSwitchChain } from 'wagmi';

import { getChainConfig } from '@/config/networks';
import useAppWallet from '@/hooks/useAppWallet';
import { useLoginStateContext } from '@/pages/sys/login/providers/LoginStateProvider';
import { useUserActions } from '@/store/userStore';
import { getChain } from '@/utils';

import CustomModal from './customModal';
// import styles from './index.module.css';

interface SwitchChainModalProps {
  isOpen: boolean;
  chainId: number;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function SwitchChainModal(props: SwitchChainModalProps) {
  const { isOpen, onConfirm, chainId, onClose } = props;
  const { disconnect, chainId: appChainId } = useAppWallet();
  const { switchChain } = useSwitchChain();

  const { clearUserInfoAndToken } = useUserActions();
  const { backToLogin } = useLoginStateContext();
  return (
    <CustomModal
      open={isOpen}
      title={<div className="text-white text-lg">当前网络与钱包网络不一致</div>}
      closable
      maskClosable
      content={
        <>
          <div className="text-white mb-9 mt-9">
            {`当前网站连接的是${getChainConfig(appChainId).name}。 钱包网络连接的是${
              getChain(chainId).name
            }`}
          </div>
          <div className="mb-4 flex flex-col items-center gap-[16px]">
            <Button
              className={['w-60'].join(' ')}
              onClick={() => {
                switchChain({ chainId: appChainId });
                onConfirm?.();
              }}
            >
              {`切换至 ${getChainConfig(appChainId).name}网络`}
            </Button>
            <Button
              className={['w-60'].join(' ')}
              onClick={() => {
                disconnect();
                clearUserInfoAndToken();
                backToLogin();
                onClose?.();
              }}
            >
              断开钱包
            </Button>
          </div>
        </>
      }
      onCancel={onClose}
    />
  );
}
