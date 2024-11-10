import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit, LocalShipping, ShoppingCart } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Typography } from '@mui/material';
import {
  saleListAction,
  saleDeleteAction,
} from '../../../../store/modules/sale';
import { clearAllSaleDetails } from '../../../../store/modules/saleDetail';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import TruckLoadForm from '../tabs/truckloads/components/TruckloadForm';
import { catTruckloadLicensePlateCatalogAction } from '../../../../store/modules/catalogs';

const useSaleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saleList = useSelector((state) => state.sale.saleList);
  const totalItems = useSelector((state) => state.sale.totalItems);
  const processing = useSelector((state) => state.sale.processing);
  const saleListDetails = useSelector((state) => state.sale.saleListDetails);
  const id_budget = useSelector((state) => state.budget.budget?.id_budget);

  const [searchList, setSearchList] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState({});
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(saleListAction());
    dispatch(catTruckloadLicensePlateCatalogAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearAllSaleDetails());
  }, [dispatch]);

  const handleOpenSaleDetailModal = (id_sale) => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Detalle de Camionada',
        description: 'Registre un nuevo detalle de camionada',
        content: <TruckLoadForm id_sale={id_sale} nonupdate />,
      })
    );
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'totalTruckloadsSentFormatted',
      headerName: 'Total Lb Enviadas',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'totalTruckloadsReceivedFormatted',
      headerName: 'Total Lb Recibidas',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'createdAtFormat',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 'fullWidth',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 170,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <ApsIconButton
              tooltip={{ title: 'Camionada' }}
              onClick={() => handleOpenSaleDetailModal(params.row.id_sale)}
              children={<LocalShipping color="primary" />}
              can={{
                key: `can-add-sale-detail-${params.row.id_sale}`,
                I: Actions.CREATE,
                a: Subjects.SALES,
              }}
            />
            {params.row.id_sale && (
              <ApsIconButton
                tooltip={{ title: 'Editar venta' }}
                onClick={() =>
                  navigate(`/main/sale/detail/${params.row.id_sale}`)
                }
                children={<Edit />}
                can={{
                  key: `can-edit-sale-${params.row.id_sale}`,
                  I: Actions.EDIT,
                  a: Subjects.SALES,
                }}
              />
            )}
            {/* {params.row.id_sale && (
              <ApsIconButton
                tooltip={{ title: 'Eliminar venta' }}
                onClick={() => handleOpenDelete(params.row)}
                children={<Delete color="error" />}
                can={{
                  key: `can-delete-sale-${params.row.id_sale}`,
                  I: Actions.DELETE,
                  a: Subjects.SALES,
                }}
              />
            )} */}
          </div>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Nombre',
    type: 'text',
    searchList: saleList,
    searchKey: 'name, createdAtFormat',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setSearchText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => navigate(`/main/sale/detail/0`),
      color: 'primary',
      can: {
        key: 'can-create-sale-record',
        I: Actions.CREATE,
        a: Subjects.SALES,
      },
    },
  };

  const handleCloseDelete = () => {
    setSaleToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setSaleToDelete(data);
  };

  const handleDelete = () => {
    dispatch(
      saleDeleteAction({
        id_sale: saleToDelete.id_sale,
      })
    );
    setOpenModalDelete(false);
  };

  const propsModalDeleteSale = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar venta',
    content: (
      <Typography>{`¿Está seguro que desea eliminar la venta de "${saleToDelete.fullName}" permanentemente?`}</Typography>
    ),
    handleOk: () => handleDelete(),
    titleOk: 'Eliminar',
    handleCancel: () => handleCloseDelete(),
    titleCancel: 'Cancelar',
    okProps: {
      color: 'error',
      endIcon: <Delete />,
    },
  };

  const labels = {
    fullName: 'Nombre Completo',
    createdAtFormatted: 'Fecha',
    totalAmountFormatted: 'Total Venta',
  };
  const fields = ['fullName', 'createdAtFormatted', 'totalAmountFormatted'];

  return {
    columns,
    saleList,
    saleListDetails,
    processing,
    propsModalDeleteSale,
    propsSearchBarButton,
    searchList,
    setSearchList,
    totalItems,
    labels,
    fields,
    searchText,
  };
};

export default useSaleList;
