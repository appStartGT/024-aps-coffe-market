import { lazy } from 'react';

const SettingsPage = lazy(() =>
  import(/* webpackChunkName: "SettingsPage" */ './pages/SettingsPage')
);

export default [
  {
    path: 'settings',
    children: [
      { index: true, element: SettingsPage },
      //   {
      //     path: 'modulos',
      //     children: [
      //       { index: true, element: ModulesPage },
      //       { path: ':id', element: ModulesPage },
      //       { path: ':idlugar/:idPosition/:idPerro', element: ModulesPage },
      //       { path: 'panito/:idHarina', element: ModulesPage },
      //     ],
      //   },
    ],
  },
];
