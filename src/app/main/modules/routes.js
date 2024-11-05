import { Navigate } from 'react-router-dom';
import administratorRoutes from './administrator/routes';
import purchase from './purchase/routes';
import expense from './expense/routes';

export default [
  ...administratorRoutes,
  ...purchase,
  ...expense,
  { path: '*', to: 'purchase', element: Navigate },
];
