import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { parseUnits } from 'ethers';
import React, { useMemo } from 'react';

import { createCommonMethods } from '@/api/common';
import { encodeData } from '@/api/multisigUtils';
import { base58ToHex } from '@/api/tronweb';
import { UsdhSdkMethodMap } from '@/config/constant';
import { ChainId, getChainConfig } from '@/config/networks';
import useAppWallet from '@/hooks/useAppWallet';
import { getChain } from '@/utils';

interface AddUserModalProps {
  isOpen: boolean;
  onOk: (data: string) => void;
  onCancel: () => void;
}

function VoteModal({ isOpen, onOk, onCancel }: AddUserModalProps): React.ReactElement {
  const [form] = useForm();
  const { chainId, address } = useAppWallet();
  const commonService = useMemo(() => createCommonMethods(chainId), [chainId]);
  // const { addTransaction, transactionState } = useTransaction(onOk);
  const network = chainId === ChainId.TRON ? 'TRC20' : getChain(chainId).name;
  const methodOptions = Object.keys(UsdhSdkMethodMap).map((key) => ({
    label: UsdhSdkMethodMap[key],
    value: key,
  }));

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { account, amount, rate, voteType } = values;
      const chainConfig = getChainConfig(chainId);
      const formateAccount =
        chainId === ChainId.TRON ? `0x${base58ToHex(account).substring(2)}` : account;
      let encode = '';
      console.log('🚀 ~ handleOk ~ formateAccount:', formateAccount);
      if (
        voteType === 'setFeeReceiver' ||
        voteType === 'addFeeList' ||
        voteType === 'removeFeeList' ||
        voteType === 'addBlackList' ||
        voteType === 'removeBlackList' ||
        voteType === 'transferOwnership'
      ) {
        encode = encodeData(voteType, ['address'], [formateAccount]);
      } else if (voteType === 'pause' || voteType === 'unpause') {
        encode = encodeData(voteType, [], []);
      } else if (voteType === 'burn' || voteType === 'mint') {
        encode = encodeData(
          voteType,
          ['address', 'uint256'],
          [formateAccount, parseUnits(amount, chainConfig.tokenList.USDH.decimal)],
        );
      } else if (voteType === 'setFeeRatio') {
        encode = encodeData(voteType, ['uint256'], [parseUnits(rate, 16)]);
      }
      onOk(encode);
    } catch (error) {
      console.error('Adding user failed:', error);
      message.error('添加用户失败，请重试');
    }
  };
  const voteTypeToStringMap: Record<string, string> = {
    setFeeReceiver: '手续费收取地址',
    addFeeList: '添加交易收费地址',
    removeFeeList: '删除交易收费地址',
    addBlackList: '添加黑名单',
    removeBlackList: '移除黑名单',
    transferOwnership: '治理合约地址',
    mint: '接收地址',
    burn: '销毁地址',
  };
  const voteType = Form.useWatch('voteType', form);

  return (
    <Modal
      title="发起提案"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="network" label="地址网络">
          <p>{network}</p>
        </Form.Item>
        <Form.Item name="address" label="提案发起地址">
          <p>{address}</p>
        </Form.Item>
        <Form.Item
          name="voteType"
          label="提案类型"
          rules={[{ required: true, message: '选择提案类型' }]}
        >
          <Select placeholder="选择提案" options={methodOptions} />
        </Form.Item>
        {(voteType === 'mint' || voteType === 'burn') && (
          <>
            <Form.Item name="token" label="币种选择">
              <p>USDH</p>
            </Form.Item>
            <Form.Item
              name="amount"
              label={voteType === 'mint' ? '增发数量' : '销毁数量'}
              rules={[
                { required: true, message: '请输入大于0的数字，最多6位小数' },
                {
                  pattern: /^(?!0(\.0{1,6})?$)(\d+(\.\d{1,6})?)$/,
                  message: '请输入大于0的数字，最多6位小数',
                },
              ]}
            >
              <Input placeholder={voteType === 'mint' ? '增发数量' : '销毁数量'} />
            </Form.Item>
          </>
        )}
        {(voteType === 'mint' ||
          voteType === 'burn' ||
          voteType === 'setFeeReceiver' ||
          voteType === 'addFeeList' ||
          voteType === 'removeFeeList' ||
          voteType === 'addBlackList' ||
          voteType === 'removeBlackList' ||
          voteType === 'transferOwnership') && (
          <Form.Item
            name="account"
            label={voteTypeToStringMap[voteType]}
            rules={[
              {
                validator(_, value, callback) {
                  if (!commonService.isAddress(value)) {
                    callback('请输入有效的钱包地址');
                  }
                  callback();
                },
                required: true,
              },
            ]}
          >
            <Input placeholder={voteTypeToStringMap[voteType]} />
          </Form.Item>
        )}
        {voteType === 'setFeeRatio' && (
          <Form.Item
            name="rate"
            label="手续费"
            rules={[
              { required: true, message: '请输入大于0的数字，最多6位小数' },
              {
                pattern: /^(?!0(\.0{1,6})?$)(\d+(\.\d{1,6})?)$/,
                message: '请输入大于0的数字，最多6位小数',
              },
            ]}
          >
            <Input placeholder="请输入手续费百分比" suffix="%" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default VoteModal;
