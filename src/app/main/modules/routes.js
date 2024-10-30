import { Navigate } from 'react-router-dom';
import administratorRoutes from './administrator/routes';
import purchase from './purchase/routes';

export default [
  ...administratorRoutes,
  ...purchase,
  { path: '*', to: 'purchase', element: Navigate },
];
