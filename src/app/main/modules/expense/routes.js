import { permissions } from '@utils';
import { lazy } from 'react';
import React from 'react';

const ExpensesListPage = lazy(() =>
  import('./pages/ExpensesListPage').catch((error) => {
    console.error('Error loading ExpensesListPage:', error);
    return { default: () => <div>Error loading page</div> };
  })
);

// const ExpensesDetailPage = lazy(() =>
//   import(
//     /* webpackChunkName: "ExpensesDetailPage" */ './pages/ExpensesDetailPage'
//   )
// );

export default [
  {
    path: 'expense',
    children: [
      {
        index: true,
        element: ExpensesListPage,
        name: permissions.Actions.MENU_EXPENSES,
      },
      // {
      //   path: 'detail',
      //   children: [
      //     {
      //       index: true,
      //       element: ExpensesDetailPage,
      //       name: permissions.Actions.MENU_EXPENSES,
      //     },
      //     {
      //       path: ':id_expense',
      //       children: [
      //         {
      //           index: true,
      //           element: ExpensesDetailPage,
      //           name: permissions.Actions.MENU_EXPENSES,
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
];
