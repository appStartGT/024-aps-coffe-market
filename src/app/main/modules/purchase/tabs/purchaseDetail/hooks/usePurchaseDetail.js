import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  purchaseDetailListAction,
  purchaseDetailDeleteAction,
  setPurchaseDetail,
  clearPurchaseDetailSelected,
} from '../../../../../../store/modules/purchaseDetail';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import PurchaseDetailForm from '../components/PurchaseDetailForm';
import { IconButton, Badge, Chip, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useMountEffect } from '@hooks';

const usePurchaseDetail = () => {
  const { id_purchase } = useParams();
  const dispatch = useDispatch();
  // const [searchList, setSearchList] = useState(null);
  const processing = useSelector((state) => state.purchaseDetail.processing);
  const purchaseList = useSelector(
    (state) => state.purchaseDetail.purchaseDetailList
  );
  const id_budget = useSelector((state) => state.budget.budget.id_budget);
  const [isQuintales, setIsQuintales] = useState(false);
  const [getAll, setGetAll] = useState(false);

  useMountEffect({
    effect: () => {
      if (getAll) {
        dispatch(purchaseDetailListAction({ id_purchase, getAll }));
      } else {
        id_budget &&
          dispatch(
            purchaseDetailListAction({
              id_purchase,
              id_budget,
              force: true,
            })
          ); // Fetch purchase details if purchaseList has items
      }
    },
    deps: [dispatch, id_budget, getAll],
  }); //refresh when the list is ready

  const onClose = () => {
    dispatch(clearPurchaseDetailSelected());
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const toggleUnit = () => {
    setIsQuintales((prevState) => !prevState);
  };

  const columns = [
    {
      field: 'quantityFormated',
      headerName: `${isQuintales ? 'Quintales (qq)' : 'Libras (lb)'}`,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
      field: 'advancePaymentAmount',
      headerName: 'Anticipo',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'budgetDate',
      headerName: 'Presupuesto',
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip
          title={
            params.row.budgetIsClosed
              ? 'Presupuesto cerrado'
              : 'Presupuesto abierto'
          }
        >
          <Chip
            label={params.row.budgetDate ? params.row.budgetDate : '-'}
            color={params.row.budgetIsClosed ? 'error' : 'success'}
            size="small"
          />
        </Tooltip>
      ),
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
          {params.row.isSold ? (
            <Tooltip title="Vendido a beneficio">
              <Chip
                label="Vendido"
                color="primary"
                size="small"
                sx={{ marginTop: 1, marginBottom: 1 }}
              />
            </Tooltip>
          ) : params.row.budgetIsClosed ? (
            <Tooltip title="Comprado en un presupuesto anterior">
              <Chip
                label="Cerrado"
                color="error"
                size="small"
                sx={{ marginTop: 1, marginBottom: 1 }}
              />
            </Tooltip>
          ) : (
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
          )}
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
    columns,
    // searchList,
    purchaseList,
    getAll,
    setGetAll,
  };
};

export default usePurchaseDetail;
