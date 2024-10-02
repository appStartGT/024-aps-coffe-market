// import { permissions } from '@utils';
import { lazy } from 'react';

const PersonPage = lazy(() =>
  import(/* webpackChunkName: "EnrollementSettingsPage" */ './pages/PersonPage')
);

export default [
  {
    path: 'users',

    children: [
      {
        index: true,
        element: PersonPage,
        // name: permissions.Actions.men,
      },
    ],
  },
];
