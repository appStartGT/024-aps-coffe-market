import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Edit, LocalShipping } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { saleListAction } from '../../../../store/modules/sale';
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

  const [searchList, setSearchList] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    dispatch(saleListAction());
    dispatch(catTruckloadLicensePlateCatalogAction());
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

  const toggleUnit = () => {
    setIsQuintales((prevState) => !prevState);
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
      headerName: `Total ${isQuintales ? 'Enviados' : 'Enviadas'} (${
        isQuintales ? 'qq' : 'lb'
      })`,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalTruckloadsSentQQFormatted
            : params.row.totalTruckloadsSentFormatted}
        </div>
      ),
    },
    {
      field: 'totalTruckloadsReceivedFormatted',
      headerName: `Total ${isQuintales ? 'Recibidos' : 'Recibidas'} (${
        isQuintales ? 'qq' : 'lb'
      }) `,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalTruckloadsReceivedQQFormatted
            : params.row.totalTruckloadsReceivedFormatted}
        </div>
      ),
    },
    {
      field: 'totalLbsSoldFormatted',
      headerName: `Total ${isQuintales ? 'Vendidos' : 'Vendidas'} (${
        isQuintales ? 'qq' : 'lb'
      })`,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalQQSoldFormatted
            : params.row.totalLbsSoldFormatted}
        </div>
      ),
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

  return {
    columns,
    saleList,
    processing,
    propsSearchBarButton,
    searchList,
    setSearchList,
    totalItems,
    searchText,
    isQuintales,
    toggleUnit,
  };
};

export default useSaleList;
