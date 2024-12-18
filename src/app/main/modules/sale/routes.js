import { permissions } from '@utils';
import { lazy } from 'react';
import React from 'react';

const SaleListPage = lazy(() =>
  import('./pages/SaleListPage').catch((error) => {
    console.error('Error loading SaleListPage:', error);
    return { default: () => <div>Error loading page</div> };
  })
);

const SaleDetailPage = lazy(() =>
  import('./pages/SaleDetailPage').catch((error) => {
    console.error('Error loading SaleDetailPage:', error);
    return { default: () => <div>Error loading page</div> };
  })
);

export default [
  {
    path: 'sale',
    children: [
      {
        index: true,
        element: SaleListPage,
        name: permissions.Actions.MENU_SALE,
      },
      {
        path: 'detail',
        children: [
          {
            index: true,
            element: SaleDetailPage,
            name: permissions.Actions.MENU_SALE,
          },
          {
            path: ':id_sale',
            children: [
              {
                index: true,
                element: SaleDetailPage,
                name: permissions.Actions.MENU_SALE,
              },
            ],
          },
        ],
      },
    ],
  },
];
