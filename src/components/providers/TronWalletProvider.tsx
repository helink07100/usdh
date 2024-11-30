import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { message } from 'antd';
// import { TronLinkAdapter } from "@tronweb3/tronwallet-adapters";

export function TronWalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WalletProvider
      // adapters={adapters}
      disableAutoConnectOnLoad
      onError={(error) => {
        if (error.message.includes('please try again later')) {
          message.error('请求太频繁，请稍后重试');
          return;
        }
        message.error(error.message);
      }}
    >
      {children}
    </WalletProvider>
  );
}
