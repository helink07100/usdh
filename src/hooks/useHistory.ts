import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { HoneUsd_ABI } from '@/api/abi';
import { createCommonMethods } from '@/api/common';
import { createContactService } from '@/api/contact';
import { decodeData, getMethodDescription } from '@/api/multisigUtils';
import { TransactionDetails } from '@/config/constant';
import { toFormateDateTime } from '@/utils';

import useAppWallet from './useAppWallet';

export enum EarnOrderStatus {
  locked,
  process,
  withdrawn,
}
const PageSize = 10;

function getDataByPage(data: number[], page: number, pageSize: number = PageSize): number[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}
export default function useHistory() {
  const { address, chainId } = useAppWallet();

  const stakeService = useMemo(() => createContactService(chainId), [chainId]);
  const commonService = useMemo(() => createCommonMethods(chainId), [chainId]);

  const { data: owner, refetch: refetchOwner } = useQuery({
    queryKey: ['getOwner', chainId],
    queryFn: () => commonService.getOwner(),
    refetchOnMount: true,
  });
  const {
    data: count,
    isLoading: queryOrderListLoading,
    refetch,
  } = useQuery({
    queryKey: ['getTransactionId', owner, chainId],
    queryFn: () => stakeService.getTransactionId(owner!),
    enabled: !!owner,
    refetchOnMount: true,
  });

  const ids = useMemo(() => {
    if (!count) {
      return [];
    }
    return Array.from({ length: Number(count.toString()) }, (_, index) => index).reverse();
  }, [count]);
  const [page, setPage] = useState(1);
  const { isLoading, data, isFetching } = useQuery({
    queryKey: ['earnHistoryData', address, page, ids, chainId],
    queryFn: () => queryHistoryData(page),
    placeholderData: keepPreviousData,
    enabled: ids.length > 0,
    refetchOnMount: true,
    staleTime: 0,
  });
  const queryHistoryData = async (page: number) => {
    const pageIds = getDataByPage(ids, page, PageSize);
    const maxConfirmCount = await stakeService.getRequired(owner!);
    const orderDetails = await Promise.all(
      pageIds.map((id: number) => stakeService.getTransaction(id, owner!)),
    );
    // const confirmationCounts = await Promise.all(
    //   pageIds.map((id: number) => stakeService.getConfirmationCount(id)),
    // );
    return new Promise((resolve) => {
      const formatOrders = pageIds.map((id: number, index: number) => {
        const {
          destination,
          value,
          data,
          executed,
          numberConfirm,
          initiator,
          initTime,
          executeTime,
        } = orderDetails[index];

        const parseData = decodeData(HoneUsd_ABI, data);
        return {
          key: id,
          id,
          method: getMethodDescription(parseData.method),
          confirmCount: numberConfirm,
          maxConfirmCount,
          destination,
          value,
          data,
          initiator,
          parseData,
          createTime: toFormateDateTime(Number(initTime) * 1000),
          updateTime: executeTime ? toFormateDateTime(Number(executeTime) * 1000) : '--',
          confirm: `${numberConfirm}/${maxConfirmCount}`,
          executed,
        };
      });
      resolve(formatOrders as TransactionDetails[]);
    });
  };

  return {
    data,
    isLoading: isFetching || isLoading || queryOrderListLoading,
    refetch,
    refetchOwner,
    total: ids.length,
    page,
    setPage,
  };
}
