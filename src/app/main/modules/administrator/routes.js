import { permissions } from '@utils';
import { lazy } from 'react';

const AdministratorPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/AdministratorPage'
  )
);
const RolDetailPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ '../roles/pages/RolDetailPage'
  )
);

export default [
  {
    path: 'administrator',
    children: [
      {
        index: true,
        element: AdministratorPage,
        name: permissions.Actions.MENU_ADMINISTRADOR,
      },
      {
        path: 'role',
        children: [
          {
            index: true,
            element: RolDetailPage,
            name: permissions.Actions.MENU_ADMINISTRADOR,
          },
          {
            path: ':id',
            element: RolDetailPage,
            name: permissions.Actions.MENU_ADMINISTRADOR,
          },
        ],
      },
    ],
  },
];
