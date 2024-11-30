import { App as AntdApp } from 'antd';
import { Helmet } from 'react-helmet-async';

import Logo from '@/assets/images/logo.png';
import Router from '@/router/index';
import AntdConfig from '@/theme/antd';

import { MotionLazy } from './components/animate/motion-lazy';
import { TronWalletProvider } from './components/providers/TronWalletProvider';

function App() {
  return (
    <AntdConfig>
      <AntdApp>
        <MotionLazy>
          <Helmet>
            <title>USDH 提案</title>
            <link rel="icon" href={Logo} />
          </Helmet>

          <TronWalletProvider>
            <Router />
          </TronWalletProvider>
        </MotionLazy>
      </AntdApp>
    </AntdConfig>
  );
}

export default App;
