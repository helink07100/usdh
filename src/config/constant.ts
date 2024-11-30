// tron config

import { ChainId } from './networks';

export const BLOCK_PER_YEAR = {
  [ChainId.TRON]: 10512000,
  [ChainId.BSC]: 10512000,
  [ChainId.BSC_TEST]: 10512000,
};

export const BLOCK_PER_DAY = {
  [ChainId.TRON]: 28800,
  [ChainId.BSC]: 28800,
  [ChainId.BSC_TEST]: 28800,
};

export const BLOCK_PER_MIN = {
  [ChainId.TRON]: 20,
  [ChainId.BSC]: 20,
  [ChainId.BSC_TEST]: 20,
};

export enum WalletType {
  TronLink = 'TronLink',
  MetaMask = 'MetaMask',
  OKX = 'OKX',
}
export interface Wallet {
  name: string;
  icon: string;
  type: WalletType;
}
export const enum TransactionStatus {
  failure = 0,
  success = 1,
  pending = 2,
}
export const WALLET_LIST: Wallet[] = [
  {
    name: 'Tronlink',
    icon: '/tronlink.svg',
    type: WalletType.TronLink,
  },
  {
    name: 'Metamask',
    icon: '/metamask.svg',
    type: WalletType.MetaMask,
  },
  {
    name: 'OKX Wallet',
    icon: '/OKX.png',
    type: WalletType.OKX,
  },
];

export interface TransactionABI {
  method: string; // The method name being called
  methodDesc: string; // Description of the method and its parameters
  methodParam: string; // Human-readable method call with parameters
  params: any;
  paramsArr: [string, number]; // Array with the parameters: [address, amount]
  data: string; // The encoded ABI data for the transaction
}
export interface TransactionDetails {
  key: number; // 交易的唯一标识符，数字类型
  id: number; // 交易 ID，数字类型
  method: string; // 交易方法的中文描述，例如 "币种发行"
  confirmCount: string; // 已确认的签名数量，字符串类型，可能需要转换为数字类型
  maxConfirmCount: number; // 最小所需确认数量，字符串类型，可能需要转换为数字类型
  destination: string; // 交易目标地址，字符串类型，例如 "0x5a55fEa69E5c681a30bC550594aE70CaA496190f"
  value: string; // 交易金额（通常以最小单位表示，如 wei），字符串类型
  data: string; // 编码后的交易数据，例如 "0x40c10f190000000000000000000000008e23c2318be3930740326e53c59e9205383559640000000000000000000000000000000000000000000000000000000005f5e100"
  initiator: string; // 发起人地址，字符串类型，例如 "0x0802CaDa4A4639452F291053F928B2D39faf312F"
  createTime: string; // 创建时间，字符串类型，表示日期和时间
  updateTime: string; // 更新时间，字符串类型，表示日期和时间
  confirm: string; // 确认状态，例如 "3/3"（表示已确认 3/3 次）
  executed: boolean; // 是否已执行，布尔类型
}

export const UsdhSdkMethodMap: Record<string, string> = {
  mint: '币种发行',
  burn: '币种销毁',
  setFeeReceiver: '设置手续费收取地址',
  setFeeRatio: '交易手续费更改',
  addFeeList: '添加交易收费地址',
  removeFeeList: '删除交易收费地址',
  addBlackList: '添加黑名单',
  removeBlackList: '移除黑名单',
  pause: '关闭交易',
  unpause: '开启交易',
  transferOwnership: '设置治理合约地址',
};
