import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saleDetailListAction,
  saleDetailDeleteAction,
  setSaleDetail,
  clearSaleDetailSelected,
} from '../../../../../../store/modules/saleDetail';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
// import SaleDetailForm from '../components/SaleDetailForm';
import { IconButton, Chip, Badge } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const useSaleDetail = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
  const processing = useSelector((state) => state.saleDetail.processing);
  const saleList = useSelector((state) => state.saleDetail.saleDetailList);
  const { id_sale } = useParams();

  useEffect(() => {
    dispatch(saleDetailListAction({ id_sale }));
  }, [dispatch]);

  const onClose = () => {
    dispatch(clearSaleDetailSelected());
    dispatch(setApsGlobalModalPropsAction({ open: false }));
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
            // content: <SaleDetailForm id_sale={id_sale} />,
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
      headerName: 'Libras',
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {(params.row.isPaid || params.row.isRemate) && (
            <Badge
              color={params.row.isRemate ? 'warning' : 'success'}
              variant="dot"
            />
          )}
          {params.row.quantityFormated}
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
      field: 'advancePaymentAmount',
      headerName: 'Anticipo',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha y hora',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          {params.row.isRemate && (
            <Chip
              label="Rematado"
              color="warning"
              size="small"
              style={{ marginRight: '8px', color: 'white' }}
            />
          )}
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id_sale_detail)}
            color="error"
            size="small"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    dispatch(setSaleDetail(row));
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Editar Venta',
        description: 'Edite los detalles de la venta',
        // content: <SaleDetailForm id_sale={id_sale} initialValues={row} />,
        onClose,
      })
    );
  };

  const handleDelete = (id_sale_detail) => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Eliminar Venta',
        description: '¿Está seguro que desea eliminar este detalle de venta?',
        content: null,
        handleOk: () => {
          dispatch(saleDetailDeleteAction({ id_sale_detail }));
          dispatch(setApsGlobalModalPropsAction({}));
        },
        handleCancel: true,
        titleOk: 'Eliminar',
        okProps: {
          color: 'error',
        },
      })
    );
  };

  return {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    saleList,
  };
};

export default useSaleDetail;
