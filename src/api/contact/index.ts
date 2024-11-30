import { ChainId } from '@/config/networks';

import { EthereumContactService } from './EthereumContactService';
import { TronContactService } from './TronContactService';
import { IContactService } from './types';

export const createContactService = (chainId: ChainId): IContactService => {
  switch (chainId) {
    case ChainId.TRON:
      return new TronContactService(chainId);
    default:
      return new EthereumContactService(chainId);
  }
};
