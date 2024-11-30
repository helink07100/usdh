export interface ICommonService {
  queryAllowance(token: string, owner: string, spender: string): Promise<any>;
  setApprove(token: string, spender: string, amount: string): Promise<any>;
  getTokenBalances(tokenAddress: string[], account: string): Promise<any>;
  getCurrentBlockNumber(): Promise<number>;
  getTimestampByBlockNumber(blockNumber: number): Promise<number>;
  getTransactionById(txId: string): Promise<any>;
  isAdmin(address: string): Promise<boolean>;
  // isOperator(address: string): Promise<boolean>;
  // isFinancial(address: string): Promise<boolean>;
  sendTransaction(value: string, data: string, to: string): Promise<any>;
  confirmTransaction(id: number): Promise<any>;
  isAddress(address: string): boolean;
  getOwner(): Promise<string>;
}
