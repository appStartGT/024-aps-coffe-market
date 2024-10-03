import { permissions } from '@utils';
import { lazy } from 'react';
import React from 'react';

const PurchaseListPage = lazy(() =>
  import('./pages/PurchaseListPage').catch((error) => {
    console.error('Error loading PurchaseListPage:', error);
    return { default: () => <div>Error loading page</div> };
  })
);

const PurchaseDetailPage = lazy(() =>
  import(
    /* webpackChunkName: "PurchaseDetailPage" */ './pages/PurchaseDetailPage'
  )
);

export default [
  {
    path: 'purchase',
    children: [
      {
        index: true,
        element: PurchaseListPage,
        name: permissions.Actions.MENU_PURCHASE,
      },
      {
        path: 'detail',
        children: [
          {
            index: true,
            element: PurchaseDetailPage,
            name: permissions.Actions.MENU_PURCHASE,
          },
          {
            path: ':id_purchase',
            children: [
              {
                index: true,
                element: PurchaseDetailPage,
                name: permissions.Actions.MENU_PURCHASE,
              },
            ],
          },
        ],
      },
    ],
  },
];
