export enum TokenSymbol {
  USDT = 'USDT',
  USDH = 'USDH',
  NATIVE = 'NATIVE',
}
export const MAIN_COIN = '0x0';

export interface TokenInfo {
  name: string;
  address: string;
  decimal: number;
}

export type TokenList = {
  [key in TokenSymbol]: TokenInfo;
};
