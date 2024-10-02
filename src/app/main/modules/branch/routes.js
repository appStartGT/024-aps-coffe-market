import { permissions } from '@utils';
import { lazy } from 'react';

const BranchListPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/BranchListPage'
  )
);
const BranchDetailPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/BranchDetailPage'
  )
);

export default [
  {
    path: 'branch',
    children: [
      {
        index: true,
        element: BranchListPage,
        name: permissions.Actions.MENU_HOSPITALARIO,
      },
      {
        path: 'detail',
        children: [
          {
            index: true,
            element: BranchDetailPage,
            name: permissions.Actions.MENU_HOSPITALARIO,
          },
          {
            path: ':id_branch',
            element: BranchDetailPage,
            name: permissions.Actions.MENU_HOSPITALARIO,
          },
        ],
      },
    ],
  },
];
