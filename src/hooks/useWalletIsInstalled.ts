import { useDocumentVisibility } from 'ahooks';
import { useEffect, useState } from 'react';

import { WalletType } from '@/config/constant';

export const useWalletIsInstalled = (walletType?: WalletType) => {
  const [isWalletIsInstalled, setIsWalletIsInstalled] = useState(true);
  const documentVisibility = useDocumentVisibility();

  useEffect(() => {
    if (documentVisibility) {
      if (walletType === WalletType.MetaMask) {
        setIsWalletIsInstalled(!!window.ethereum);
      } else if (walletType === WalletType.OKX) {
        setIsWalletIsInstalled(!!window.okxwallet);
      } else {
        setIsWalletIsInstalled(!!window.tronLink);
      }
    }
  }, [documentVisibility, walletType]);

  return isWalletIsInstalled;
};
