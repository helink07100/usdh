import { Descriptions, Modal } from 'antd';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { getMethodDescription } from '@/api/multisigUtils';
import { hexToBase58 } from '@/api/tronweb';
import { TransactionABI } from '@/config/constant';
import { ChainId } from '@/config/networks';
import useAppWallet from '@/hooks/useAppWallet';
import { useChainConfig } from '@/hooks/useChainConfig';
import { getChain } from '@/utils';

interface SwitchModalProps {
  isOpen: boolean;
  abi: TransactionABI;
  onOk: () => void;
  onCancel: () => void;
}

function TransactionModal(props: SwitchModalProps) {
  const { isOpen, onOk, abi, onCancel } = props;
  const { chainId } = useAppWallet();
  const chainConfig = useChainConfig();
  const lists = useMemo(() => {
    if (!abi) {
      return [];
    }
    const network = chainId === ChainId.TRON ? 'TRC20' : getChain(chainId).name;

    switch (abi.method) {
      case 'mint':
        return [
          {
            key: '币种网络',
            value: network,
          },
          {
            key: '币种名称',
            value: 'USDH',
          },
          {
            key: '币种符号',
            value: 'USDH',
          },
          {
            key: '本次增发量',
            value: formatUnits(BigInt(abi.params.amount), chainConfig.tokenList.USDH.decimal),
          },
          {
            key: '接收地址',
            value: chainId === ChainId.TRON ? hexToBase58?.(abi.params.to) : abi.params.to,
          },
        ];
        break;
      case 'burn':
        return [
          {
            key: '币种网络',
            value: network,
          },
          {
            key: '币种名称',
            value: 'USDH',
          },
          {
            key: '币种符号',
            value: 'USDH',
          },
          {
            key: '本次销毁量',
            value: formatUnits(BigInt(abi.params.amount), chainConfig.tokenList.USDH.decimal),
          },
          {
            key: '销毁地址',
            value:
              chainId === ChainId.TRON ? hexToBase58?.(abi.params.account) : abi.params.account,
          },
        ];
      case 'addBlackList':
      case 'removeBlackList':
        return [
          {
            key: '黑名单网络',
            value: network,
          },
          {
            key: '黑名单地址',
            value:
              chainId === ChainId.TRON ? hexToBase58?.(abi.params.account) : abi.params.account,
          },
          {
            key: '操作方式',
            value: abi.method === 'addBlackList' ? '添加黑名单' : '删除黑名单',
          },
        ];
        break;
      case 'addFeeList':
      case 'removeFeeList':
        return [
          {
            key: '收费地址网络',
            value: network,
          },
          {
            key: '交易收费地址',
            value:
              chainId === ChainId.TRON ? hexToBase58?.(abi.params.account) : abi.params.account,
          },
          {
            key: '操作方式',
            value: abi.method === 'addFeeList' ? '添加地址' : '删除地址',
          },
        ];
        break;
      case 'setFeeReceiver':
        return [
          {
            key: '收款地址网络',
            value: network,
          },
          {
            key: '手续费收款地址',
            value:
              chainId === ChainId.TRON
                ? hexToBase58?.(abi.params.newReceiver)
                : abi.params.newReceiver,
          },
          {
            key: '操作方式',
            value: '编辑地址',
          },
        ];
        break;
      case 'setFeeRatio':
        return [
          {
            key: '收费网络',
            value: network,
          },
          {
            key: '收费比例',
            value: `${formatUnits(abi.params.newRatio, 16)}%`,
          },
          {
            key: '操作类型',
            value: '交易手续费更改',
          },
        ];
        break;
      case 'transferOwnership':
        return [
          {
            key: '治理合约网络',
            value: network,
          },
          {
            key: '治理合约地址',
            value:
              chainId === ChainId.TRON ? hexToBase58?.(abi.params.newOwner) : abi.params.newOwner,
          },
          {
            key: '操作方式',
            value: '治理合约地址变更',
          },
        ];
        break;

      case 'pause':
      case 'unpause':
        return [
          {
            key: '币种网络',
            value: network,
          },
          {
            key: '操作方式',
            value: abi.method === 'pause' ? '关闭交易' : '开启交易',
          },
        ];
        break;
      default:
        return [];
        break;
    }
  }, [abi, chainConfig.tokenList.USDH.decimal, chainId]);

  return (
    <Modal
      width="600px"
      open={isOpen}
      onOk={onOk}
      cancelText="取消"
      okText="关闭"
      destroyOnClose
      title={getMethodDescription(abi?.method)}
      onCancel={onCancel}
    >
      <Descriptions title={false} column={1} bordered>
        {lists.map((item) => (
          <Descriptions.Item label={item.key} key={item.key}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Modal>
  );
}

export default TransactionModal;
