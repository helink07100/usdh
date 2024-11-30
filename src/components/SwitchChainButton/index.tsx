import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, message, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useConnections } from 'wagmi';

import { chainConfigs, ChainId } from '@/config/networks';
import useAppWallet from '@/hooks/useAppWallet';
import { useLoginStateContext } from '@/pages/sys/login/providers/LoginStateProvider';
import { useUserActions } from '@/store/userStore';

import SwitchChainModal from '../SwitchChainModal';

export default function SwitchChainButton() {
  const { chainId, disconnect } = useAppWallet();
  const connections = useConnections();
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState<boolean>(false);

  const ethRealChainId = connections?.[0]?.chainId;

  useEffect(() => {
    if (chainId === ChainId.TRON || !ethRealChainId) {
      return;
    }
    if (ethRealChainId !== chainId) {
      setIsSwitchModalOpen(true);
    } else {
      setIsSwitchModalOpen(false);
    }
  }, [chainId, ethRealChainId]);

  const { clearUserInfoAndToken } = useUserActions();
  const { backToLogin } = useLoginStateContext();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === String(chainId)) {
      return;
    }
    message.info('请重新选择链并登录');
    disconnect();
    clearUserInfoAndToken();
    backToLogin();
  };

  const menuProps = {
    items: Object.values(chainConfigs)
      .filter((item) => item.isTest === import.meta.env.VITE_ENABLE_TESTNETS)
      .map((chain) => ({
        label: chain.name,
        key: String(chain.chainId),
      })),
    onClick: handleMenuClick,
  };
  const matchItem = useMemo(
    () => menuProps.items.find((item) => item?.key === String(chainId)),
    [chainId, menuProps.items],
  );
  return (
    <>
      <Dropdown menu={menuProps}>
        <Button size="large" className="mr-4">
          <Space>
            {matchItem ? matchItem.label : '未支持网络'}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      {isSwitchModalOpen && (
        <SwitchChainModal
          chainId={ethRealChainId}
          isOpen={isSwitchModalOpen}
          onConfirm={() => setIsSwitchModalOpen(false)}
          onClose={() => setIsSwitchModalOpen(false)}
        />
      )}
    </>
  );
}
