import React, { useState, useMemo } from 'react';
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
import SaleDetailForm from '../../saleDetail/components/SaleDetailForm';
import { Box, Chip, IconButton } from '@mui/material';
import { Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import RemateDetailsForm from '../components/RemateDetailsForm';
import { BlobProvider } from '@react-pdf/renderer';
import PdfComprobante from '../components/PdfComprobante';

const useSaleDetail = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
  const processing = useSelector((state) => state.saleDetail.processing);

  const saleListPriceless = useSelector(
    (state) => state.saleDetail.saleDetailListPriceless
  );

  const { id_sale } = useParams();

  const [selectionModel, setSelectionModel] = useState([]);
  useEffect(() => {
    dispatch(saleDetailListAction({ id_sale }));
  }, [dispatch, id_sale]);

  const totalSelectedQuantity = useMemo(() => {
    const selectedRows = (searchList || saleListPriceless).filter((row) =>
      selectionModel.includes(row.id)
    );
    return selectedRows.reduce((sum, row) => sum + Number(row.quantity), 0);
  }, [selectionModel, searchList, saleListPriceless]);

  const onClose = () => {
    dispatch(clearSaleDetailSelected());
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };
  const propsSearchBarButton = {
    label: 'Buscar por Libras / Precio / Total',
    type: 'text',
    searchList: saleListPriceless,
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
            content: <SaleDetailForm id_sale={id_sale} />,
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
              onClick={() => handleDelete(params.row.id_sale_detail)}
              color="error"
              size="small"
            >
              <Delete />
            </IconButton>
            <BlobProvider
              document={
                <PdfComprobante
                  title={`Venta ${params.row?.id}`}
                  content={params.row}
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

  const handleEdit = (row) => {
    dispatch(setSaleDetail(row));
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Editar Venta',
        description: 'Edite los detalles de la venta',
        content: <SaleDetailForm id_sale={id_sale} initialValues={row} />,
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
    const selectedItems = (searchList || saleListPriceless).filter((item) =>
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
    saleListPriceless,
    selectionModel,
    setSelectionModel,
    totalSelectedQuantity,
    handleRemate,
  };
};

export default useSaleDetail;
