import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save } from '@mui/icons-material';
import { Paper } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMountEffect } from '@hooks';
import ApsForm from '@components/ApsForm';
import ApsButton from '@components/ApsButton';
import { Actions, Subjects } from '@config/permissions';
import Can, { Ability } from '@components/permissions/Can';
import ApsInfoAlert from '@components/ApsInfoAlert';
import useSaleForm from './useSaleForm';
// import SaleDetailPage from '../tabs/saleDetail/pages/SaleDetailPage';
// import SaleDetailPricelessPage from '../tabs/saleDetailPriceless/pages/SaleDetailPricelessPage';

import {
  clearSaleSelected,
  saleGetOneAction,
} from '../../../../store/modules/sale';
import TruckloadPage from '../tabs/truckloads/pages/TruckloadPage';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const useSaleDetail = () => {
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
  const { formikSale, handleOnclick, loading } = useSaleForm({
    navigate,
  });
  const saleSelected = useSelector((state) => state.sale.saleSelected);

  /* USE EFFECTS */
  useMountEffect({
    effect: () => {
      if (params.id_sale !== '0') {
        dispatch(saleGetOneAction({ id_sale: params.id_sale }));
      }
    },
    deps: [dispatch, params.id_sale],
  });

  useEffect(() => {
    return () => {
      dispatch(clearSaleSelected());
    };
  }, [dispatch]);

  const canDetails = {
    key: 'can-sale-details',
    I: Actions.EDIT,
    a: Subjects.SALES,
  };

  const propsButtonSaveDetails = {
    endIcon: <Save />,
    variant: 'contained',
    children: 'Guardar',
    style: { borderRadius: 8 },
    color: 'primary',
    size: 'large',
    disabled: !formikSale.form.isValid || loading,
    onClick: handleOnclick,
    can: canDetails,
  };

  const propsTabsComponent = () => {
    const tabs = [];
    if (ability.can(Actions.SALES_TAB_DETALLES, Subjects.SALES)) {
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
            <ApsForm title="" formik={formikSale} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '32px',
              }}
            >
              <ApsButton {...propsButtonSaveDetails} />
            </div>
          </Paper>
        ),
      });
    }

    if (params.id_sale !== '0') {
      if (ability.can(Actions.SALES_TAB_PAGOS, Subjects.SALES)) {
        tabs.push({
          title: 'Camionadas',
          content: <TruckloadPage />,
        });
        // tabs.push({
        //   title: 'Ventas (Sin precio)',
        //   content: <SaleDetailPricelessPage />,
        // });
      }
    }
    return { tabs };
  };

  return {
    formikSale,
    handleOnclick,
    saleSelected,
    lastLocation,
    navigate,
    params,
    propsTabsComponent,
  };
};

export default useSaleDetail;
