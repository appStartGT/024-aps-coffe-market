import { permissions } from '@utils';

// const RolesPage = lazy(() =>
//   import(
//     /* webpackChunkName: "EnrollementSettingsPage" */ './pages/RolListPage'
//   )
// );

// const RolDetailPage = lazy(() =>
//   import(
//     /* webpackChunkName: "EnrollementSettingsPage" */ './pages/RolDetailPage'
//   )
// );

const RolesPage = () =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/RolListPage'
  );

const RolDetailPage = () =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/RolDetailPage'
  );

export default [
  {
    path: 'roles',
    children: [
      { index: true, element: RolesPage, name: permissions.Actions.MENU_ROLES },
      {
        path: 'role',
        children: [
          {
            index: true,
            element: RolDetailPage,
            name: permissions.Actions.MENU_ROLES,
          },
          {
            path: ':id',
            element: RolDetailPage,
            name: permissions.Actions.MENU_ROLES,
          },
        ],
      },
    ],
  },
];
