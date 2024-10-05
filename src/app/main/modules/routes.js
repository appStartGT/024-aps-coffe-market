import { Navigate } from 'react-router-dom';
import administratorRoutes from './administrator/routes';
import employees from './employees/routes';
import purchase from './purchase/routes';

export default [
  ...employees,
  ...administratorRoutes,
  ...purchase,
  { path: '*', to: 'purchase', element: Navigate },
];
