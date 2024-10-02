import { permissions } from '@utils';
import { lazy } from 'react';

const InventoryListPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/InventoryListPage'
  )
);
const InventoryDetailPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/InventoryDetailPage'
  )
);

export default [
  {
    path: 'inventory',
    children: [
      {
        index: true,
        element: InventoryListPage,
        name: permissions.Actions.MENU_EMPLOYEES,
      },
      {
        path: 'detail',
        children: [
          {
            index: true,
            element: InventoryDetailPage,
            name: permissions.Actions.MENU_EMPLOYEES,
          },
          {
            path: ':id_inventory/:id_branch',
            children: [
              {
                index: true,
                element: InventoryDetailPage,
                name: permissions.Actions.MENU_EMPLOYEES,
              },
            ],
          },
        ],
      },
    ],
  },
];
