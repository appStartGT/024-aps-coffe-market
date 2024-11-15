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
import purchase from './modules/purchase';
import customer from './modules/customer';
import purchaseDetail from './modules/purchaseDetail';
import budget from './modules/budget';
import expense from './modules/expense';
import averagePrice from './modules/averagePrice';
import saleDetail from './modules/saleDetail';
import sale from './modules/sale';
import truckload from './modules/truckload';

export const store = configureStore({
  reducer: {
    administrator,
    catalogs,
    login,
    main,
    permission,
    role,
    subject,
    theme,
    user,
    purchase,
    customer,
    purchaseDetail,
    budget,
    expense,
    averagePrice,
    saleDetail,
    sale,
    truckload,
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
