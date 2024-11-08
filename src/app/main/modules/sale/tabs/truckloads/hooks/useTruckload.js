import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Actions, Subjects } from '@config/permissions';
import TruckloadForm from '../components/TruckloadForm';
import {
  truckloadListAction,
  truckloadDeleteAction,
  setTruckloadDetail,
  clearTruckloadSelected,
} from '../../../../../../store/modules/truckload';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { catTruckloadLicensePlateCatalogAction } from '../../../../../../store/modules/catalogs';

const useTruckload = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
  const processing = useSelector((state) => state.truckload.processing);
  const truckloadList = useSelector((state) => state.truckload.truckloadList);
  const { id_sale } = useParams();

  useEffect(() => {
    dispatch(truckloadListAction({ id_sale }));
    dispatch(catTruckloadLicensePlateCatalogAction());
  }, [dispatch, id_sale]);

  const onClose = () => {
    dispatch(clearTruckloadSelected());
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const propsSearchBarButton = {
    label: 'Buscar por Libras / Precio / Total',
    type: 'text',
    searchList: truckloadList,
    searchResults: (results) => setSearchList(results),
    searchKey: 'quantity, priceFormat, totalFormat',
    rightButton: {
      icon: 'add_circle',
      onClick: () =>
        dispatch(
          setApsGlobalModalPropsAction({
            open: true,
            maxWidth: 'xs',
            title: 'Camionada',
            description: 'Registre una nueva camionada',
            content: <TruckloadForm id_sale={id_sale} />,
            onClose,
          })
        ),
      color: 'primary',
      can: {
        key: 'can-create-truckload-record',
        I: Actions.CREATE,
        a: Subjects.TRUCKLOADS,
      },
    },
  };

  const columns = [
    {
      field: 'licensePlate',
      headerName: 'Placa',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'totalSentFormated',
      headerName: 'Total enviado',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'totalReceivedFormated',
      headerName: 'Total recibido',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'colillaUrl',
      headerName: 'Colilla',
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.colillaUrl ? (
          <a href={params.row.colillaUrl} target="_blank" rel="noreferrer">
            Ver colilla
          </a>
        ) : (
          'Sin colilla'
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
            onClick={() => handleDelete(params.row.id_beneficio_truckload)}
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
    dispatch(setTruckloadDetail(row));
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Editar Camionada',
        description: 'Edite los detalles de la camionada',
        content: <TruckloadForm id_sale={id_sale} />,
        onClose,
        closeBtn: true,
      })
    );
  };

  const handleDelete = (id_beneficio_truckload) => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Eliminar Camionada',
        description: '¿Está seguro que desea eliminar esta camionada?',
        content: null,
        handleOk: () => {
          dispatch(truckloadDeleteAction({ id_beneficio_truckload }));
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
    truckloadList,
  };
};

export default useTruckload;
