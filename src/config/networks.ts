import { MAIN_COIN, TokenList, TokenSymbol } from './tokens';

export interface ChainConfig {
  name: string;
  chainId: number;
  multicall: string;
  rpc: string;
  USDH: string;
  MultiSigWallet: string;
  isEVM: boolean;
  isTest: string;
  tokenList: TokenList;
  gridApiKey?: string;
}

export enum ChainId {
  ETH = 1,
  SEPOLIA = 11155111,
  BSC = 56,
  BSC_TEST = 97,
  TRON = 728126428,
}

export const chainConfigs: { [key in ChainId]: ChainConfig } = {
  [ChainId.BSC]: {
    name: 'BNB Chain',
    chainId: ChainId.BSC,
    isEVM: true,
    isTest: 'false',
    rpc: 'https://bsc-dataseed.binance.org',
    USDH: '0xF5FDe0604ecaF4Bb7990e51aAf90ee357AEca158',
    MultiSigWallet: '0x95d0b19e7a430a64Ff221166f153a952CB58599b',
    multicall: '0x3914dB0c0412A242e17F37F64B6395484202154C',
    tokenList: {
      [TokenSymbol.USDT]: {
        name: TokenSymbol.USDT,
        address: '0x55d398326f99059fF775485246999027B3197955',
        decimal: 18,
      },
      [TokenSymbol.USDH]: {
        name: TokenSymbol.USDH,
        address: '0x0eb599a807a40b129af31e5f4e49c4e5d59801ee',
        decimal: 6,
      },
      [TokenSymbol.NATIVE]: {
        name: 'BNB',
        address: MAIN_COIN,
        decimal: 18,
      },
    },
  },
  [ChainId.BSC_TEST]: {
    name: 'BNB Smart Chain Testnet',
    chainId: ChainId.BSC_TEST,
    isEVM: true,
    isTest: 'true',
    rpc: 'https://little-multi-hill.bsc-testnet.quiknode.pro/e12b77dd7e5d298d7ddfc79810a1b3001a3f1812',
    USDH: '0x5a55fEa69E5c681a30bC550594aE70CaA496190f',
    MultiSigWallet: '0x5F40c243bcA316d46F03BfCDA936a5125Bfa8Da4',
    multicall: '0x50F960A428d6732320A45a569276892EAcc42f79',

    tokenList: {
      [TokenSymbol.USDT]: {
        name: TokenSymbol.USDT,
        address: '0x19e9248109Dc312Ff75fcAf3f70371360cd610a1',
        decimal: 18,
      },
      [TokenSymbol.USDH]: {
        name: TokenSymbol.USDH,
        address: '0x5a55fEa69E5c681a30bC550594aE70CaA496190f',
        decimal: 6,
      },
      [TokenSymbol.NATIVE]: {
        name: 'BNB',
        address: MAIN_COIN,
        decimal: 18,
      },
    },
  },
  [ChainId.ETH]: {
    name: 'Ethereum',
    chainId: ChainId.ETH,
    isEVM: true,
    isTest: 'false',
    rpc: 'https://lively-special-borough.quiknode.pro/664e161c600acc7dcbc1e37e820bdcc6c9534006/',
    USDH: '0x50d3E54B5CC046C1B7Cf24E53B608f24E87Af9Ec',
    MultiSigWallet: '0xeb82AFF2B7462a6d71c4092fd406f0235698464B',
    multicall: '0x7cdCB0Cc61f47B8Dd8f47C5A29edaDd84a1BDf5e',

    tokenList: {
      [TokenSymbol.USDT]: {
        name: TokenSymbol.USDT,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimal: 6,
      },
      [TokenSymbol.USDH]: {
        name: TokenSymbol.USDH,
        address: '0x50d3E54B5CC046C1B7Cf24E53B608f24E87Af9Ec',
        decimal: 6,
      },
      [TokenSymbol.NATIVE]: {
        name: 'ETH',
        address: MAIN_COIN,
        decimal: 18,
      },
    },
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    chainId: ChainId.SEPOLIA,
    isEVM: true,
    isTest: 'true',
    rpc: 'https://autumn-delicate-aura.ethereum-sepolia.quiknode.pro/df0dafc3edc2fc7edaa753cfcc3520fa70084bbf',
    USDH: '0x50d3E54B5CC046C1B7Cf24E53B608f24E87Af9Ec',
    MultiSigWallet: '0xeb82AFF2B7462a6d71c4092fd406f0235698464B',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',

    tokenList: {
      [TokenSymbol.USDT]: {
        name: TokenSymbol.USDT,
        address: '0xC7E8A2f2E0cd65f47658624550421285FfF5474D',
        decimal: 6,
      },
      [TokenSymbol.USDH]: {
        name: TokenSymbol.USDH,
        address: '0x50d3E54B5CC046C1B7Cf24E53B608f24E87Af9Ec',
        decimal: 6,
      },
      [TokenSymbol.NATIVE]: {
        name: 'ETH',
        address: MAIN_COIN,
        decimal: 18,
      },
    },
  },
  [ChainId.TRON]:
    import.meta.env.VITE_ENABLE_TESTNETS === 'true'
      ? {
          name: 'TRON Nile Testnet',
          chainId: ChainId.TRON,
          isEVM: false,
          isTest: 'true',
          rpc: 'https://nile.trongrid.io/',
          USDH: 'TKHbx2MYZZ6RJH2RqAZLcEmBThskmgFoqT',
          MultiSigWallet: 'TK8Zvf8Z9pEyv3hdzgJdmjfDUoiRA5sagc',
          gridApiKey: '090111a7-759c-4c52-b19f-b15fcd53dc41',
          multicall: 'TRCEAUS2Yy48v4TBTpdkUnQCxvLiW3sKoU',
          tokenList: {
            [TokenSymbol.USDT]: {
              name: TokenSymbol.USDT,
              address: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
              decimal: 6,
            },
            [TokenSymbol.USDH]: {
              name: TokenSymbol.USDH,
              address: 'TKHbx2MYZZ6RJH2RqAZLcEmBThskmgFoqT',
              decimal: 6,
            },
            [TokenSymbol.NATIVE]: {
              name: 'TRX',
              address: MAIN_COIN,
              decimal: 6,
            },
          },
        }
      : {
          name: 'TRON Mainnet',
          chainId: ChainId.TRON,
          isEVM: false,
          isTest: 'false',
          rpc: 'https://api.trongrid.io',
          USDH: 'TKHbx2MYZZ6RJH2RqAZLcEmBThskmgFoqT',
          MultiSigWallet: 'TK8Zvf8Z9pEyv3hdzgJdmjfDUoiRA5sagc',
          gridApiKey: '090111a7-759c-4c52-b19f-b15fcd53dc41',
          multicall: 'TWSaaayu3N1z5GKeWYyTkUG1p9tw3tdTHw',
          tokenList: {
            [TokenSymbol.USDT]: {
              name: TokenSymbol.USDT,
              address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
              decimal: 6,
            },
            [TokenSymbol.USDH]: {
              name: TokenSymbol.USDH,
              address: 'TKHbx2MYZZ6RJH2RqAZLcEmBThskmgFoqT',
              decimal: 6,
            },
            [TokenSymbol.NATIVE]: {
              name: 'TRX',
              address: MAIN_COIN,
              decimal: 6,
            },
          },
        },
};

export function getChainConfig(chainId: ChainId): ChainConfig {
  const config = chainConfigs[chainId];
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return config;
}
