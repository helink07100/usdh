import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import { createCommonMethods } from '@/api/common';
import useAppWallet from '@/hooks/useAppWallet';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { useRoleActions } from './roleStore';

import { UserInfo, UserToken } from '#/entity';
import { StorageEnum, UserRoleType } from '#/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<UserToken>(StorageEnum.Token) || {},
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: {} });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const navigatge = useNavigate();
  const { message } = App.useApp();
  const { setUserToken, setUserInfo } = useUserActions();
  const { setAdminAddress } = useRoleActions();
  const { disconnect, chainId } = useAppWallet();

  const signIn = async (data: { address: string }) => {
    const commonService = createCommonMethods(chainId);
    try {
      const isAdmin = await commonService.isAdmin(data.address);

      let role = UserRoleType.OTHER;
      if (isAdmin) {
        setAdminAddress(data.address);
        role = UserRoleType.ADMIN;
      }
      if (role === UserRoleType.OTHER) {
        message.error('该地址不允许登录,请切换钱包');
        disconnect();
        return;
      }
      setUserToken({ accessToken: data.address });
      setUserInfo({ role, id: data.address });
      navigatge(HOMEPAGE, { replace: true });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  return signIn;
};

export default useUserStore;
