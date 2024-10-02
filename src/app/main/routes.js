import { permissions } from '@utils';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Login = lazy(() =>
  import(/* webpackChunkName: "Login" */ './login/pages/LoginPage')
);
const ResetPassword = lazy(() =>
  import(/* webpackChunkName: "Login" */ './login/pages/ResetPassword')
);
const Main = lazy(() =>
  import(/* webpackChunkName: "Main" */ './modules/main/pages/Main')
);

const routes = [
  {
    path: 'login',
    element: Login,
  },
  {
    path: 'resetpassword',
    element: ResetPassword,
    // name: permissions.Actions.RESET_PASSWORD,
  },
  {
    path: '/main/*',
    element: Main,
    name: permissions.Actions.MAIN,
  },
  {
    path: '*',
    to: 'login',
    element: Navigate,
  },
];

export default routes;
