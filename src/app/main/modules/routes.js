import { Navigate } from 'react-router-dom';
import administratorRoutes from './administrator/routes';
// import settingsRoutes from './settings/routes';
import salesRoutes from './sales/routes';
import productsRoutes from './products/routes';
import organization from './organization/routes';
import employees from './employees/routes';
import inventories from './inventories/routes';

export default [
  // ...settingsRoutes,
  ...employees,
  ...administratorRoutes,
  ...salesRoutes,
  ...productsRoutes,
  ...organization,
  ...inventories,
  { path: '*', to: 'sales', element: Navigate },
];
