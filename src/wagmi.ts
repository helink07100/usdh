import { createConfig, http } from 'wagmi';
import { bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [
    bsc,
    mainnet,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? [bscTestnet, sepolia] : []),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
