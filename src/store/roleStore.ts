import { message } from 'antd';
import { useCallback } from 'react';
import { create } from 'zustand';

import useAppWallet from '@/hooks/useAppWallet';
import { getItem, setItem } from '@/utils/storage';

import { useUserInfo } from './userStore';

import { StorageEnum, UserRoleType } from '#/enum';

// interface RoleStoreType {
//   adminAddr: string;
//   // isOperate: boolean;
//   // isFinancial: boolean;
// }
type RoleStore = {
  adminAddr: string;
  actions: {
    setAdminAddress: (address: string) => void;
    // fetchIsOperate: (address: string) => void;
    // fetchIsFinancial: (address: string) => void;
  };
};

const useRoleStore = create<RoleStore>((set) => ({
  adminAddr: getItem(StorageEnum.ADMIN) || '',
  actions: {
    setAdminAddress: (admin: string) => {
      // const address = await adminAddress();
      if (admin) {
        set({ adminAddr: admin });
        setItem(StorageEnum.ADMIN, admin);
      }
    },
  },
}));
export const useAdminAddress = () => useRoleStore((state) => state.adminAddr);
export const useIsAdminWallet = () => {
  const { address } = useAppWallet();
  const admin = useRoleStore((state) => state.adminAddr);
  if (!address || !admin) {
    return false;
  }
  return admin?.toLocaleLowerCase() === address?.toLocaleLowerCase();
};

// 1 是运营 2是财务
export const useRoleCheck = () => {
  const isAdmin = useIsAdminWallet();
  // const route = useRouter();
  // const { address } = useWallet();
  const { role } = useUserInfo();

  // const { data: isOperate } = useQuery({
  //   queryKey: ['isOperate', address],
  //   queryFn: () => isOperator(address!),
  //   enabled: !!address,
  // });
  // const { data: isFin } = useQuery({
  //   queryKey: ['isFinancial', address],
  //   queryFn: () => isFinancial(address!),
  //   enabled: !!address,
  // });
  const checkOperateRole = useCallback(() => {
    if (!isAdmin && role !== UserRoleType.OPERATE) {
      message.warning('只有管理员和运营可以进行操作');
      return false;
    }
    return true;
  }, [isAdmin, role]);

  const checkFinancialRole = useCallback(() => {
    if (!isAdmin && role !== UserRoleType.FINANCE) {
      message.warning('只有管理员和财务可以进行操作');
      return false;
    }
    return true;
  }, [isAdmin, role]);

  // useEffect(() => {
  //   if (!isFin && !isAdmin && !isOperate) {
  //     // route.replace('/403');
  //   }
  // }, [isFin, isAdmin, isOperate, route]);
  return { checkOperateRole, checkFinancialRole };
};
export const useRoleActions = () => useRoleStore((state) => state.actions);
