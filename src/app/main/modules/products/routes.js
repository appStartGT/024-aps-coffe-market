import { permissions } from '@utils';
import { lazy } from 'react';

const ProductsList = lazy(() =>
  import(/* webpackChunkName: "ProductosListPage" */ './pages/ProductsList')
);

export default [
  {
    path: 'product',
    children: [
      {
        index: true,
        element: ProductsList,
        name: permissions.Actions.MENU_PRODUCTO,
      },
    ],
  },
];
