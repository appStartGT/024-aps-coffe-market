import { Navigate } from 'react-router-dom';
import administratorRoutes from './administrator/routes';
import purchase from './purchase/routes';
import expense from './expense/routes';
import sale from './sale/routes';

export default [
  ...administratorRoutes,
  ...purchase,
  ...expense,
  ...sale,
  { path: '*', to: 'purchase', element: Navigate },
];
