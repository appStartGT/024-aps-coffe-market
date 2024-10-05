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
import person from './modules/person';
import employee from './modules/employee';
import purchase from './modules/purchase';
import customer from './modules/customer';
import purchaseDetail from './modules/purchaseDetail';

export const store = configureStore({
  reducer: {
    administrator,
    catalogs,
    login,
    main,
    permission,
    person,
    role,
    settings,
    subject,
    theme,
    user,
    employee,
    purchase,
    customer,
    purchaseDetail,
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
