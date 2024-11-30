// import { Suspense } from 'react';

// import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

// function Wrapper({ children }: any) {
//   return <Suspense fallback={<CircleLoading />}>{children}</Suspense>;
// }
const others: AppRouteObject[] = [
  // {
  //   element: (
  //     <Wrapper>
  //       <div />
  //     </Wrapper>
  //   ),
  //   meta: {
  //     label: 'sys.menu.disabled',
  //     icon: <SvgIcon icon="ic_disabled" className="ant-menu-item-icon" size="24" />,
  //     disabled: true,
  //     key: '/disabled',
  //   },
  // },
  // {
  //   path: 'label',
  //   element: (
  //     <Wrapper>
  //       <div />
  //     </Wrapper>
  //   ),
  //   meta: {
  //     label: 'sys.menu.label',
  //     icon: <SvgIcon icon="ic_label" className="ant-menu-item-icon" size="24" />,
  //     suffix: (
  //       <ProTag color="cyan" icon={<Iconify icon="solar:bell-bing-bold-duotone" size={14} />}>
  //         NEW
  //       </ProTag>
  //     ),
  //     key: '/label',
  //   },
  // },
  // {
  //   path: 'frame',
  //   meta: {
  //     label: 'sys.menu.frame',
  //     icon: <SvgIcon icon="ic_external" className="ant-menu-item-icon" size="24" />,
  //     key: '/frame',
  //   },
  //   children: [
  //     {
  //       path: 'external_link',
  //       element: (
  //         <Wrapper>
  //           <ExternalLink src="https://ant.design/index-cn" />
  //         </Wrapper>
  //       ),
  //       meta: {
  //         label: 'sys.menu.external_link',
  //         key: '/frame/external_link',
  //       },
  //     },
  //     {
  //       path: 'iframe',
  //       element: (
  //         <Wrapper>
  //           <Iframe src="https://ant.design/index-cn" />
  //         </Wrapper>
  //       ),
  //       meta: {
  //         label: 'sys.menu.iframe',
  //         key: '/frame/iframe',
  //       },
  //     },
  //   ],
  // },
];

export default others;
