import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save } from '@mui/icons-material';
import { Paper, Box } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMountEffect } from '@hooks';
import ApsForm from '@components/ApsForm';
import ApsButton from '@components/ApsButton';
import { Actions, Subjects } from '@config/permissions';
import Can, { Ability } from '@components/permissions/Can';
import ApsInfoAlert from '@components/ApsInfoAlert';
import usePurchaseForm from './usePurchaseForm';

import {
  clearPurchaseSelected,
  purchaseGetOneAction,
} from '../../../../store/modules/purchase';
import PurchaseDetailPage from '../tabs/purchaseDetail/pages/PurchaseDetailPage';
import PurchaseDetailPricelessPage from '../tabs/purchaseDetailPriceless/pages/PurchaseDetailPricelessPage';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const usePurchaseDetail = () => {
  /* HOOKS */
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const ability = Ability();
  const lastLocation = location?.substring(
    0,
    location.lastIndexOf('/', location.lastIndexOf('/') - 1)
  );
  const { formikPurchase, handleOnclick, handleDelete, loading } =
    usePurchaseForm({ navigate });
  const purchaseSelected = useSelector(
    (state) => state.purchase.purchaseSelected
  );

  /* USE EFFECTS */
  useMountEffect({
    effect: () => {
      if (params.id_purchase !== '0') {
        dispatch(purchaseGetOneAction({ id_purchase: params.id_purchase }));
      }
    },
  });

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS
    return () => {
      dispatch(clearPurchaseSelected());
    };
  }, [dispatch]);

  const canDetails = {
    key: 'can-purchase-details',
    I: Actions.EDIT,
    a: Subjects.PURCHASES,
  };

  const propsButtonSaveDetails = {
    endIcon: <Save />,
    variant: 'contained',
    children: 'Guardar',
    style: { borderRadius: 8 },
    color: 'primary',
    size: 'large',
    disabled: !formikPurchase.form.isValid || loading,
    onClick: handleOnclick,
    can: canDetails,
  };

  const propsButtonDelete = {
    children: 'Eliminar',
    color: 'error',
    size: 'large',
    variant: 'outlined',
    onClick: handleDelete,
    can: canDetails,
  };

  const propsTabsComponent = () => {
    let tabs = [];
    ability.can(Actions.PURCHASES_TAB_DETALLES, Subjects.PURCHASES) &&
      tabs.push({
        title: 'Detalles',
        content: (
          <Paper sx={stylesPaper}>
            <Can not {...canDetails}>
              <ApsInfoAlert
                severity="error"
                text="No tienes permisos para modificar el registro."
              />
            </Can>
            <ApsForm title="" formik={formikPurchase} />
            <Box
              display="flex"
              justifyContent={
                params.id_purchase !== '0' ? 'space-between' : 'flex-end'
              }
              gap={2}
              width="100%"
              marginTop="32px"
            >
              {params.id_purchase !== '0' && (
                <ApsButton {...propsButtonDelete} />
              )}
              <ApsButton {...propsButtonSaveDetails} />
            </Box>
          </Paper>
        ),
      });

    if (params.id_purchase !== '0') {
      ability.can(Actions.PURCHASES_TAB_PAGOS, Subjects.PURCHASES) &&
        tabs.push({
          title: 'Compras',
          content: <PurchaseDetailPage />,
        });
      ability.can(Actions.PURCHASES_TAB_PAGOS, Subjects.PURCHASES) &&
        tabs.push({
          title: 'Compras (Sin precio)',
          content: <PurchaseDetailPricelessPage />, //purchases without price (cafe sin precio)
        });
    }
    return { tabs: tabs };
  };

  return {
    formikPurchase,
    handleOnclick,
    purchaseSelected,
    lastLocation,
    navigate,
    params,
    propsTabsComponent,
  };
};

export default usePurchaseDetail;
