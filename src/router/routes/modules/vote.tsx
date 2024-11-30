import { AuditOutlined } from '@ant-design/icons';
import { lazy, Suspense } from 'react';

import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const ContractManagePage = lazy(() => import(`@/pages/vote/index`));

function Wrapper({ children }: any) {
  return <Suspense fallback={<CircleLoading />}>{children}</Suspense>;
}
const others: AppRouteObject[] = [
  {
    order: 3,
    path: 'vote',
    element: (
      <Wrapper>
        <ContractManagePage />
      </Wrapper>
    ),
    meta: {
      label: '提案',
      icon: <AuditOutlined />,
      key: '/vote',
    },
  },
];

export default others;
