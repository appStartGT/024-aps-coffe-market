import { configureStore } from '@reduxjs/toolkit';
import theme from './theme';
import login from './login';
import main from './modules/main';
import role from './modules/role';
import user from './modules/user';
import subject from './modules/subject';
import permission from './modules/permission';
import administrator from './modules/administrator';

import catalogs from './modules/catalogs';
import settings from './modules/settings';
import hospitalario from './modules/hospitalario';
import products from './modules/products';
import sales from './modules/sales';
import person from './modules/person';
import organization from './modules/organization';
import branch from './modules/branch';
import employee from './modules/employee';
import inventory from './modules/inventory';
import productInventory from './modules/productInventory';

export const store = configureStore({
  reducer: {
    administrator,
    catalogs,
    hospitalario,
    products,
    login,
    main,
    organization,
    permission,
    person,
    role,
    settings,
    subject,
    theme,
    user,
    sales,
    branch,
    employee,
    inventory,
    productInventory,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const returnWithSlice = (component, stateName, reducer) => {
  store.replaceReducer({
    ...store.reducer,
    [stateName]: reducer.reducer,
  });
  return component;
};
