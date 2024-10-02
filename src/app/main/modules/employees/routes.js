import { permissions } from '@utils';
import { lazy } from 'react';

const EmployeeListPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/EmployeeListPage'
  )
);
const EmployeeDetailPage = lazy(() =>
  import(
    /* webpackChunkName: "EnrollementSettingsPage" */ './pages/EmployeeDetailPage'
  )
);

export default [
  {
    path: 'employee',
    children: [
      {
        index: true,
        element: EmployeeListPage,
        name: permissions.Actions.MENU_EMPLOYEES,
      },
      {
        path: 'detail',
        children: [
          {
            index: true,
            element: EmployeeDetailPage,
            name: permissions.Actions.MENU_EMPLOYEES,
          },
          {
            path: ':id_employee',
            children: [
              {
                index: true,
                element: EmployeeDetailPage,
                name: permissions.Actions.MENU_EMPLOYEES,
              },
            ],
          },
        ],
      },
    ],
  },
];
