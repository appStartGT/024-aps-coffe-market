import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  purchaseDetailListAction,
  purchaseDetailDeleteAction,
  setPurchaseDetail,
  clearPurchaseDetailSelected,
} from '../../../../../../store/modules/purchaseDetail';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import PurchaseDetailForm from '../../purchaseDetail/components/PurchaseDetailForm';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const usePurchaseDetail = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
  const processing = useSelector((state) => state.purchaseDetail.processing);

  const purchaseListPriceless = useSelector(
    (state) => state.purchaseDetail.purchaseDetailListPriceless
  );

  const { id_purchase } = useParams();

  useEffect(() => {
    if (Array.isArray(purchaseListPriceless) && !purchaseListPriceless.length) {
      dispatch(purchaseDetailListAction({ id_purchase })); // Fetch purchase details if purchaseListPriceless has items
    }
  }, [dispatch]);

  const onClose = () => {
    dispatch(clearPurchaseDetailSelected());
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };
  const propsSearchBarButton = {
    label: 'Buscar por Libras / Precio / Total',
    type: 'text',
    searchList: purchaseListPriceless,
    searchResults: (results) => setSearchList(results),
    searchKey: 'quantity, priceFormat, totalFormat',
    rightButton: {
      icon: 'add_circle',
      onClick: () =>
        dispatch(
          setApsGlobalModalPropsAction({
            open: true,
            maxWidth: 'xs',
            title: 'Compra',
            description: 'Registre un nuevo detalle de compra',
            content: <PurchaseDetailForm id_purchase={id_purchase} />,
            onClose,
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
    {
      field: 'quantity',
      headerName: 'Libras',
      flex: 1,
      disableColumnMenu: true,
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
      headerName: 'Fecha',
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
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id_purchase_detail)}
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
    dispatch(setPurchaseDetail(row));
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Editar Compra',
        description: 'Edite los detalles de la compra',
        content: (
          <PurchaseDetailForm id_purchase={id_purchase} initialValues={row} />
        ),
        onClose,
      })
    );
  };

  const handleDelete = (id_purchase_detail) => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Eliminar Compra',
        description: '¿Está seguro que desea eliminar este detalle de compra?',
        content: null,
        handleOk: () => {
          dispatch(purchaseDetailDeleteAction({ id_purchase_detail }));
          dispatch(setApsGlobalModalPropsAction({ open: false }));
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
    purchaseListPriceless,
  };
};

export default usePurchaseDetail;
