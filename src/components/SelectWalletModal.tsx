import { useDebounceEffect } from 'ahooks';
import { useState } from 'react';

import OKXIcon from '@/assets/images/OKX.png';
import { Wallet, WALLET_LIST, WalletType } from '@/config/constant';
import useConnectWallet from '@/hooks/useConnectWallet';
import { useWalletIsInstalled } from '@/hooks/useWalletIsInstalled';

import CustomModal from './customModal';
import { SvgIcon } from './icon';

interface SelectWalletModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function SelectWalletModal(props: SelectWalletModalProps) {
  const { isOpen, onConfirm, onClose } = props;

  const connectWallet = useConnectWallet();

  const [wallet, setWallet] = useState<Wallet>();
  const isInstallWallet = useWalletIsInstalled(wallet?.type);

  useDebounceEffect(() => {
    if (wallet && isInstallWallet) {
      connectWallet(wallet.type);
      onConfirm?.();
    }
  }, [isInstallWallet, wallet]);
  return (
    <CustomModal
      open={isOpen}
      width={480}
      className="no-pd-model"
      title={
        wallet ? (
          <div className="flex items-center justify-center p-6">
            {wallet.type === WalletType.OKX ? (
              <img src={OKXIcon} className="h-[48px] w-[48px]" alt="okx" />
            ) : (
              <SvgIcon icon={wallet.icon} size={48} />
            )}

            <div className="text-white ml-6 w-40 text-lg font-bold leading-6">
              {isInstallWallet
                ? `正在打开 ${wallet.name} 请在${wallet.name} 中确认`
                : `未连接到 ${wallet.name}, 请先完成安装`}
            </div>
          </div>
        ) : (
          <div className="text-white flex items-center justify-center p-6">请选择钱包</div>
        )
      }
      maskClosable
      content={
        <div className="flex flex-col gap-6 p-6 pt-4">
          <div className="flex flex-col justify-start">
            <div className="text-white mb-4 text-lg">选择钱包</div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {WALLET_LIST.map((i) => (
                <div
                  className="hover:border-red-600 flex cursor-pointer items-center justify-start rounded-lg border border-gray-400 p-4"
                  onClick={() => {
                    setWallet(i);
                  }}
                  key={i.name}
                >
                  {i.type === WalletType.OKX ? (
                    <img src={OKXIcon} className="h-[24px] w-[24px]" alt="okx" />
                  ) : (
                    <SvgIcon icon={i.icon} size={24} />
                  )}
                  <div className="text-white ml-4 text-base">{i.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      onCancel={() => onClose?.()}
    />
  );
}
