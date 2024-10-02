import { permissions } from '@utils';
import { lazy } from 'react';

const StoreListPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/StoreListPage'
  )
);

export default [
  {
    path: 'sales',
    children: [
      {
        index: true,
        element: StoreListPage,
        name: permissions.Actions.MENU_VENTAS,
      },
    ],
  },
];
