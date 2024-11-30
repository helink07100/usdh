import { Form, message, Modal, Typography } from 'antd';
import { useMemo, useState } from 'react';

import { createCommonMethods } from '@/api/common';
import { hexToBase58 } from '@/api/tronweb';
import { TransactionDetails, TransactionStatus } from '@/config/constant';
import { ChainId, getChainConfig } from '@/config/networks';
import useAppWallet from '@/hooks/useAppWallet';
import useTransaction from '@/hooks/useTransaction';
import { handleEthersError } from '@/utils';

interface SwitchModalProps {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  isInit: boolean;
  data?: string;
  vote?: TransactionDetails;
}

const { Text } = Typography;

function SignModal(props: SwitchModalProps) {
  const { isOpen, onOk, data, onCancel, isInit, vote } = props;
  const { address, chainId } = useAppWallet();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const commonService = useMemo(() => createCommonMethods(chainId), [chainId]);

  const { addTransaction, transactionState } = useTransaction(onOk);

  const handleOk = async () => {
    setLoading(true);
    const chainConfig = getChainConfig(chainId);
    try {
      if (data) {
        const transaction = await commonService.sendTransaction('0', data, chainConfig.USDH);
        addTransaction(transaction);
      } else {
        const transaction = await commonService.confirmTransaction(vote!.id);
        addTransaction(transaction);
      }
    } catch (error) {
      console.log('🚀 ~ handleOk ~ error:', error);
      message.error(handleEthersError(error));
    } finally {
      setLoading(false);
    }
  };
  const initAdd = useMemo(() => {
    if (isInit) {
      return address;
    }
    return chainId === ChainId.TRON ? hexToBase58?.(vote?.initiator ?? '') : vote?.initiator;
  }, [chainId, isInit, address, vote?.initiator]);
  return (
    <Modal
      width={650}
      title={vote?.method}
      open={isOpen}
      onOk={handleOk}
      cancelText="取消"
      okText="确认签名"
      destroyOnClose
      onCancel={onCancel}
      confirmLoading={loading || transactionState === TransactionStatus.pending}
    >
      <Form
        form={form}
        preserve={false}
        name="setting"
        labelCol={{ span: 6 }}
        initialValues={{ withdrawType: 1 }}
        autoComplete="off"
      >
        <Form.Item label="提案发起地址" required>
          <Text type="secondary">{initAdd}</Text>
        </Form.Item>
        {!isInit && (
          <Form.Item label="签名地址" required>
            <Text type="secondary">{address}</Text>
          </Form.Item>
        )}
        <p className="text-center ">
          {isInit ? '提案发起成功，请点击确认签名交易！' : '请点击确认进行签名交易！'}
        </p>
      </Form>
    </Modal>
  );
}

export default SignModal;
