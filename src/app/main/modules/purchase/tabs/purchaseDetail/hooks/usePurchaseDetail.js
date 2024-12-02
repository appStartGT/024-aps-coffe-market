import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  purchaseDetailListAction,
  purchaseDetailDeleteAction,
  setPurchaseDetail,
  clearPurchaseDetailSelected,
} from '../../../../../../store/modules/purchaseDetail';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import PurchaseDetailForm from '../components/PurchaseDetailForm';
import { IconButton, Badge, Chip, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useMountEffect } from '@hooks';

const usePurchaseDetail = () => {
  const { id_purchase } = useParams();
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
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

  const propsSearchBarButton = {
    label: 'Buscar por Libras / Precio / Total',
    type: 'text',
    searchList: purchaseList,
    searchResults: (results) => setSearchList(results),
    searchKey: 'quantity, priceFormat, totalFormat',
    hideSearchBar: true,
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

  const handleAdd = () => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Compra',
        description: 'Registre un nuevo detalle de compra',
        content: <PurchaseDetailForm id_purchase={id_purchase} />,
        onClose,
      })
    );
  };

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
    propsSearchBarButton,
    columns,
    searchList,
    purchaseList,
    handleAdd,
    getAll,
    setGetAll,
  };
};

export default usePurchaseDetail;
