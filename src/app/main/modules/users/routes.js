// import { permissions } from '@utils';
import { lazy } from 'react';

const UsersTabPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/UsersTabPage'
  )
);

export default [
  {
    path: 'users',

    children: [
      {
        index: true,
        element: UsersTabPage,
        // name: permissions.Actions.men,
      },
    ],
  },
];
