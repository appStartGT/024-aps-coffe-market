import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Actions, Subjects } from '@config/permissions';
import TruckloadForm from '../components/TruckloadForm';
import PriceList from '../components/PriceList';
import {
  truckloadListAction,
  truckloadDeleteAction,
  setTruckloadDetail,
  clearTruckloadSelected,
} from '../../../../../../store/modules/truckload';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { catTruckloadLicensePlateCatalogAction } from '../../../../../../store/modules/catalogs';
import { getUnaveragesPurchaseDetailsAction } from '../../../../../../store/modules/averagePrice';

const useTruckload = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [isQuintales, setIsQuintales] = useState(false);
  const processing = useSelector((state) => state.truckload.processing);
  const truckloadList = useSelector((state) => state.truckload.truckloadList);
  const rowTruckloads = useSelector((state) => state.sale.rowTruckloads);
  const { id_sale } = useParams();

  useEffect(() => {
    dispatch(truckloadListAction({ id_sale }));
    dispatch(catTruckloadLicensePlateCatalogAction());
    dispatch(getUnaveragesPurchaseDetailsAction());
  }, [dispatch, rowTruckloads, id_sale]);

  const onClose = () => {
    dispatch(clearTruckloadSelected());
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const toggleUnit = () => {
    setIsQuintales((prevState) => !prevState);
  };

  const propsSearchBarButton = {
    label: 'Buscar por Placa',
    type: 'text',
    searchList: truckloadList,
    searchResults: (results) => setSearchList(results),
    searchKey: 'licensePlate',
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
      headerName: `Total enviado (${isQuintales ? 'qq' : 'lb'})`,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalSentQQFormated
            : params.row.totalSentFormated}
        </div>
      ),
    },
    {
      field: 'totalReceivedFormated',
      headerName: `Total recibido (${isQuintales ? 'qq' : 'lb'})`,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalReceivedQQFormated
            : params.row.totalReceivedFormated}
        </div>
      ),
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
          <Tooltip
            title={
              params.row.isSold
                ? 'No se puede editar una camionada vendida'
                : ''
            }
          >
            <span>
              <IconButton
                onClick={() => handleEdit(params.row)}
                color="primary"
                size="small"
                disabled={params.row.isSold}
              >
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={
              params.row.isSold
                ? 'No se puede eliminar una camionada vendida'
                : ''
            }
          >
            <span>
              <IconButton
                onClick={() => handleDelete(params.row.id_beneficio_truckload)}
                color="error"
                size="small"
                disabled={params.row.isSold}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
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

  const totalReceivedSelected = selectionModel.reduce((sum, id) => {
    const selectedItem = truckloadList.find((item) => item.id === id);
    return sum + (selectedItem ? Number(selectedItem.totalReceived) : 0);
  }, 0);

  const handleRemate = (selectedIds) => {
    const selectedTruckloads = truckloadList.filter((truckload) =>
      selectedIds.includes(truckload.id)
    );
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Remate a Beneficio',
        description: 'Seleccione los precios para el remate',
        content: (
          <PriceList
            selectedTruckloads={selectedTruckloads}
            totalNeeded={totalReceivedSelected}
            id_sale={id_sale}
            onClose={() => {
              onClose();
              setSelectionModel([]); // Unselect everything when handleRemate finishes
            }}
          />
        ),
        onClose: () => {
          onClose();
          setSelectionModel([]); // Unselect everything when modal is closed
        },
        closeBtn: true,
      })
    );
  };

  return {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    truckloadList,
    selectionModel,
    setSelectionModel,
    handleRemate,
    totalReceivedSelected,
    isQuintales,
    toggleUnit,
  };
};

export default useTruckload;
