export interface IContactService {
  // 根据交易 ID 返回交易详情
  getTransaction(transactionId: number, multiSigWallet: string): Promise<any>;
  // 返回当前最新的交易 ID
  getTransactionId(multiSigWallet: string): Promise<number>;
  // 返回执行合约所需的多签最小数量
  getRequired(multiSigWallet: string): Promise<number>;
}
