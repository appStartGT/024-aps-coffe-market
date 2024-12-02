import React, { useState, useMemo } from 'react';
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
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import RemateDetailsForm from '../components/RemateDetailsForm';
import { BlobProvider } from '@react-pdf/renderer';
import PdfComprobante from '../components/PdfComprobante';
import { useMountEffect } from '@hooks';

const usePurchaseDetail = () => {
  const { id_purchase } = useParams();
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
  const processing = useSelector((state) => state.purchaseDetail.processing);

  const purchaseListPriceless = useSelector(
    (state) => state.purchaseDetail.purchaseDetailListPriceless
  );
  const id_budget = useSelector((state) => state.budget.budget.id_budget);
  const [isQuintales, setIsQuintales] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
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
          );
      }
    },
    deps: [dispatch, id_budget, getAll],
  });

  const totalSelectedQuantity = useMemo(() => {
    const selectedRows = (searchList || purchaseListPriceless).filter((row) =>
      selectionModel.includes(row.id)
    );
    return selectedRows.reduce((sum, row) => sum + Number(row.quantity), 0);
  }, [selectionModel, searchList, purchaseListPriceless]);

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
      headerName: 'Fecha',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      disableColumnMenu: true,
      flex: 0.8,
      renderCell: (params) => {
        if (params.row.isRemate) {
          return (
            <Chip
              label="Rematado"
              color="warning"
              size="small"
              style={{ marginRight: '8px', color: 'white' }}
            />
          );
        }
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
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
            <BlobProvider
              document={
                <PdfComprobante
                  purchaseCode={params.row?.id}
                  content={{ ...params.row }}
                />
              }
            >
              {({ url }) => (
                <IconButton
                  onClick={() => window.open(url, '_blank')}
                  color="secondary"
                  size="small"
                >
                  <PictureAsPdf />
                </IconButton>
              )}
            </BlobProvider>
          </Box>
        );
      },
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

  const handleRemate = () => {
    const selectedItems = (searchList || purchaseListPriceless).filter((item) =>
      selectionModel.includes(item.id)
    );

    const handleComplete = () => {
      setSelectionModel([]);
    };

    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'sm',
        title: 'Resumen del Remate',
        description: 'Detalles de los items seleccionados para remate',
        content: (
          <RemateDetailsForm
            selectedItems={selectedItems}
            handleComplete={handleComplete}
          />
        ),
        titleOk: 'Confirmar Remate',
        okProps: {
          color: 'primary',
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
    selectionModel,
    setSelectionModel,
    totalSelectedQuantity,
    handleRemate,
    handleAdd,
    getAll,
    setGetAll,
  };
};

export default usePurchaseDetail;
