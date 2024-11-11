import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Badge } from '@mui/material';
import { Actions, Subjects } from '@config/permissions';
import {
  saleDetailListAction,
  clearSaleDetailSelected,
} from '../../../../../../store/modules/saleDetail';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { formatNumber } from '@utils';

const useSaleDetail = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
  const [isQuintales, setIsQuintales] = useState(false);
  const processing = useSelector((state) => state.saleDetail.processing);
  const saleList = useSelector((state) => state.saleDetail.saleDetailList);
  const { id_sale } = useParams();

  useEffect(() => {
    dispatch(saleDetailListAction({ id_sale }));
  }, [dispatch, id_sale]);

  const onClose = () => {
    dispatch(clearSaleDetailSelected());
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const toggleUnit = () => {
    setIsQuintales((prevState) => !prevState);
  };

  const convertToQuintales = (value) => {
    return formatNumber(parseFloat(value.replace(/,/g, '')) / 100);
  };

  const propsSearchBarButton = {
    label: 'Buscar por Libras / Precio / Total',
    type: 'text',
    searchList: saleList,
    searchResults: (results) => setSearchList(results),
    searchKey: 'quantity, priceFormat, totalFormat',
    rightButton: {
      icon: 'add_circle',
      onClick: () =>
        dispatch(
          setApsGlobalModalPropsAction({
            open: true,
            maxWidth: 'xs',
            title: 'Venta',
            description: 'Registre un nuevo detalle de venta',
            onClose,
          })
        ),
      color: 'primary',
      can: {
        key: 'can-create-sale-record',
        I: Actions.CREATE,
        a: Subjects.SALES,
      },
    },
  };

  const columns = [
    {
      field: 'quantityFormated',
      headerName: isQuintales ? 'Quintales' : 'Libras',
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 0px',
            cursor: 'pointer',
          }}
          onClick={toggleUnit}
        >
          {(params.row.isPaid || params.row.isRemate) && (
            <Badge
              color={params.row.isRemate ? 'warning' : 'success'}
              variant="dot"
            />
          )}
          {isQuintales
            ? params.row.quantityQQFormated
            : params.row.quantityFormated}
        </div>
      ),
    },
    {
      field: 'priceFormat',
      headerName: 'Precio',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'totalFormat',
      headerName: 'Total',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha y hora',
      flex: 1,
      disableColumnMenu: true,
    },
  ];

  return {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    saleList,
    isQuintales,
    toggleUnit,
  };
};

export default useSaleDetail;
