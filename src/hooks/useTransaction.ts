import { useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { createCommonMethods } from '@/api/common';
import { TransactionStatus } from '@/config/constant';

import useAppWallet from './useAppWallet';

export default function useTransaction(refresh?: Function, failBack?: Function) {
  const [transactionState, setTransactionState] = useState<TransactionStatus>();
  const [txId, setTxId] = useState<string>();
  const { chainId } = useAppWallet();
  const commonService = useMemo(() => createCommonMethods(chainId), [chainId]);
  const { data } = useQuery({
    queryKey: ['transactionInfo', txId, chainId],
    queryFn: () => commonService.getTransactionById(txId!),
    enabled: !!txId,
    refetchInterval: 3000,
  });
  const addTransaction = useCallback((txId: string) => {
    setTxId(txId);
    setTransactionState(TransactionStatus.pending);
    notification.info({
      key: txId,
      message: `交易${txId}已提交`,
    });
  }, []);

  useEffect(() => {
    if (data && txId) {
      if (data.status === 1) {
        // 成功通知
        notification.success({
          key: txId,
          message: `交易${txId}已上链`,
        });
        setTxId(undefined);
        refresh?.();
        setTransactionState(TransactionStatus.success);
        return;
      }
      if (data.status === 0) {
        // 失败通知
        notification.error({
          key: txId,
          message: `交易${txId}上链失败`,
        });
        setTxId(undefined);
        failBack?.(data);
        setTransactionState(TransactionStatus.failure);
        return;
      }
      setTransactionState(TransactionStatus.pending);
    }
  }, [data, txId, refresh, failBack]);
  return { addTransaction, transactionState };
}
