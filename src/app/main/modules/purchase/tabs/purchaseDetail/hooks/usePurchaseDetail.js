import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  purchaseDetailListAction,
  purchaseDetailDeleteAction,
} from '../../../../../../store/modules/purchaseDetail';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import PurchaseDetailForm from '../components/PurchaseDetailForm';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const usePurchaseDetail = () => {
  const dispatch = useDispatch();
  const purchaseList = useSelector(
    (state) => state.purchaseDetail.purchaseDetailList
  );
  const processing = useSelector((state) => state.purchaseDetail.processing);

  const propsModalDeletePurchase = {
    open: false,
    onClose: () => {},
    onConfirm: (id) => {
      dispatch(purchaseDetailDeleteAction(id));
    },
  };

  useEffect(() => {
    dispatch(purchaseDetailListAction());
  }, [dispatch]);

  const propsSearchBarButton = {
    label: 'Buscar por Nombre / Dirección / Teléfono',
    type: 'text',
    searchList: purchaseList,
    searchKey: 'quantity, price, total, createdAt',
    rightButton: {
      icon: 'add_circle',
      onClick: () =>
        dispatch(
          setApsGlobalModalPropsAction({
            open: true,
            maxWidth: 'xs',
            title: 'Compra',
            description: 'Registre un nuevo detalle de compra',
            content: <PurchaseDetailForm />,
          })
        ),
      color: 'primary',
      can: {
        key: 'can-create-purchase-record',
        I: Actions.CREATE,
        a: Subjects.PURCHASES,
      },
    },
  };
  const columns = [
    // { field: 'id_purchase_detail', headerName: 'ID', flex: 1 },
    { field: 'quantity', headerName: 'Libras', flex: 1 },
    { field: 'price', headerName: 'Precio', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1 },
    { field: 'isPriceless', headerName: 'Sin Precio', flex: 1 },
    { field: 'createdAt', headerName: 'Fecha', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id_purchase_detail)}
            color="secondary"
            size="small"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    console.log('Edit row:', row);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log('Delete id:', id);
    // Implement delete functionality
  };

  return {
    processing,
    propsSearchBarButton,
    columns,
    purchaseList,
    propsModalDeletePurchase,
  };
};

export default usePurchaseDetail;
