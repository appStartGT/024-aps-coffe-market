import { permissions } from '@utils';
import { lazy } from 'react';

const OrganizationListPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/OrganizationListPage'
  )
);
const OrganizationDetailPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/OrganizationDetailPage'
  )
);
const BranchDetailPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ '../branch/pages/BranchDetailPage'
  )
);

export default [
  {
    path: 'organizations',
    children: [
      {
        index: true,
        element: OrganizationListPage,
        name: permissions.Actions.MENU_ORGANIZATIONS,
      },
      {
        path: 'detail',
        children: [
          {
            index: true,
            element: OrganizationDetailPage,
            name: permissions.Actions.MENU_ORGANIZATIONS,
          },
          {
            path: ':id_organization',
            children: [
              {
                index: true,
                element: OrganizationDetailPage,
                name: permissions.Actions.MENU_ORGANIZATIONS,
              },
              {
                path: 'branch/:id_branch',
                element: BranchDetailPage,
                name: permissions.Actions.MENU_ORGANIZATION,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'organization',
    children: [
      {
        path: 'detail/:id_organization',
        children: [
          {
            index: true,
            element: OrganizationDetailPage,
            name: permissions.Actions.MENU_ORGANIZATION,
          },
          {
            path: 'branch/:id_branch',
            element: BranchDetailPage,
            name: permissions.Actions.MENU_ORGANIZATION,
          },
        ],
      },
    ],
  },
];
