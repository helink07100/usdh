import { useDebounceEffect } from 'ahooks';
import { Button, Spin } from 'antd';
import { useState } from 'react';

import SelectWalletModal from '@/components/SelectWalletModal';
import useAppWallet from '@/hooks/useAppWallet';
import { useSignIn } from '@/store/userStore';

function LoginForm() {
  // const { t } = useTranslation();
  // const themeToken = useThemeToken();
  const [loading, setLoading] = useState(false);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const { address, chainId } = useAppWallet();
  const signIn = useSignIn();

  useDebounceEffect(() => {
    if (address) {
      handleFinish();
    }
  }, [address, chainId]);

  // if (loginState !== LoginStateEnum.LOGIN) return null;
  const handleFinish = async () => {
    setLoading(true);
    try {
      await signIn({ address: address! });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div className="mb-4 text-2xl font-bold xl:text-3xl">{t('sys.login.signInFormTitle')}</div> */}
      {/* <WalletActionButton /> */}
      <Button
        type="primary"
        className="min-w-[120px] !text-lg"
        onClick={() => setIsWalletModalOpen(true)}
      >
        连接钱包
      </Button>
      <Spin spinning={loading} fullscreen />
      {isWalletModalOpen && (
        <SelectWalletModal
          isOpen={isWalletModalOpen}
          onConfirm={() => setIsWalletModalOpen(false)}
          onClose={() => setIsWalletModalOpen(false)}
        />
      )}
      {/* <Form
        name="login"
        size="large"
        initialValues={{
          remember: true,
          username: DEFAULT_USER.username,
          password: DEFAULT_USER.password,
        }}
        onFinish={handleFinish}
      >
        <div className="flex flex-col mb-4">
          <Alert
            type="info"
            description={
              <div className="flex flex-col">
                <div className="flex">
                  <ProTag className="flex-shrink-0">Admin {t('sys.login.userName')}:</ProTag>
                  <strong className="ml-1" style={{ color: themeToken.colorInfoTextHover }}>
                    <span>{DEFAULT_USER.username}</span>
                  </strong>
                </div>

                <div className="flex">
                  <ProTag className="flex-shrink-0">Test {t('sys.login.userName')}:</ProTag>
                  <strong className="ml-1" style={{ color: themeToken.colorInfoTextHover }}>
                    <span>{TEST_USER.username}</span>
                  </strong>
                </div>

                <div>
                  <ProTag className="flex-shrink-0">{t('sys.login.password')}:</ProTag>
                  <strong className="ml-1 " style={{ color: themeToken.colorInfoTextHover }}>
                    {DEFAULT_USER.password}
                  </strong>
                </div>
              </div>
            }
            showIcon
          />
        </div>

        <Form.Item
          name="username"
          rules={[{ required: true, message: t('sys.login.accountPlaceholder') }]}
        >
          <Input placeholder={t('sys.login.userName')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
        >
          <Input.Password type="password" placeholder={t('sys.login.password')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {t('sys.login.loginButton')}
          </Button>
        </Form.Item>
      </Form> */}
    </>
  );
}

export default LoginForm;
