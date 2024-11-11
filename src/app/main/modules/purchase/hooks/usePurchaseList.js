import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit, ShoppingCart } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Typography } from '@mui/material';
import {
  purchaseListAction,
  purchaseDeleteAction,
} from '../../../../store/modules/purchase';
import { getBudgetAction } from '../../../../store/modules/budget';
import { clearAllPurchaseDetails } from '../../../../store/modules/purchaseDetail';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import PurchaseDetailForm from '../tabs/purchaseDetail/components/PurchaseDetailForm';

const usePurchaseList = () => {
  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* selectors */
  const purchaseList = useSelector((state) => state.purchase.purchaseList);
  const totalItems = useSelector((state) => state.purchase.totalItems);
  const processing = useSelector((state) => state.purchase.processing);
  const purchaseListDetails = useSelector(
    (state) => state.purchase.purchaseListDetails
  );
  const id_budget = useSelector((state) => state.budget.budget?.id_budget);
  /* States */
  const [searchList, setSearchList] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState({});
  const [, setText] = useState('');
  const [isQuintales, setIsQuintales] = useState(false);

  /* use Effects */

  useEffect(() => {
    id_budget && dispatch(purchaseListAction({ id_budget }));
  }, [dispatch, id_budget]);

  /* get budget */
  useEffect(() => {
    dispatch(getBudgetAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearAllPurchaseDetails());
  }, [dispatch]);

  const handleOpenPurchaseDetailModal = (id_purchase) => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Detalle de Compra',
        description: 'Registre un nuevo detalle de compra',
        content: <PurchaseDetailForm id_purchase={id_purchase} nonupdate />,
      })
    );
  };

  const toggleUnit = () => {
    setIsQuintales((prevState) => !prevState);
  };

  const columns = [
    {
      field: 'fullName',
      headerName: 'Nombre Completo',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'totalLbPricedFormatted',
      headerName: `Total ${isQuintales ? '(qq)' : '(lb)'}`,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalQQPricedFormatted
            : params.row.totalLbPricedFormatted}
        </div>
      ),
    },
    {
      field: 'totalLbPricelessFormatted',
      headerName: `Total Sin Precio ${isQuintales ? '(qq)' : '(lb)'}`,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1.5,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalQQPricelessFormatted
            : params.row.totalLbPricelessFormatted}
        </div>
      ),
    },
    {
      field: 'totalLbRemateFormatted',
      headerName: `Total Remate ${isQuintales ? '(qq)' : '(lb)'}`,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <div onClick={toggleUnit} style={{ cursor: 'pointer' }}>
          {isQuintales
            ? params.row.totalQQRemateFormatted
            : params.row.totalLbRemateFormatted}
        </div>
      ),
    },
    {
      field: 'averagePriceFormatted',
      headerName: 'Precio Promedio',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'totalAdvancePaymentsFormatted',
      headerName: 'Anticipos',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'totalDebtFormatted',
      headerName: 'Total Deuda',
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
      sticky: true,
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
            {params.row.id_purchase && (
              <ApsIconButton
                tooltip={{ title: 'Editar registro' }}
                onClick={() =>
                  navigate(`/main/purchase/detail/${params.row.id_purchase}`)
                }
                children={<Edit color="" />}
                can={{
                  key: `can-edit-purchase-${params.row.id_purchase}`,
                  I: Actions.EDIT,
                  a: Subjects.PURCHASES,
                }}
              />
            )}
            {params.row.id_purchase && (
              <ApsIconButton
                tooltip={{ title: 'Eliminar compra' }}
                onClick={() => handleOpenDelete(params.row)}
                children={<Delete color="error" />}
                can={{
                  key: `can-delete-purchase-${params.row.id_purchase}`,
                  I: Actions.DELETE,
                  a: Subjects.PURCHASES,
                }}
              />
            )}
            <ApsIconButton
              tooltip={{ title: 'Comprar' }}
              onClick={() =>
                handleOpenPurchaseDetailModal(params.row.id_purchase)
              }
              children={<ShoppingCart color="primary" />}
              can={{
                key: `can-buy-purchase-${params.row.id_purchase}`,
                I: Actions.CREATE,
                a: Subjects.PURCHASES,
              }}
            />
          </div>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Nombre / Direccion / Teléfono ',
    type: 'text',
    searchList: purchaseList,
    searchKey: 'fullName, email, address',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => navigate(`/main/purchase/detail/0`),
      color: 'primary',
      can: {
        key: 'can-create-purchase-record',
        I: Actions.CREATE,
        a: Subjects.PURCHASES,
      },
    },
  };

  const handleCloseDelete = () => {
    setPurchaseToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setPurchaseToDelete(data);
  };

  const handleDelete = () => {
    dispatch(
      purchaseDeleteAction({
        id_purchase: purchaseToDelete.id_purchase,
      })
    );
    setOpenModalDelete(false);
  };

  const propsModalDeletePurchase = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar compra',
    content: (
      <Typography>{`Está seguro que desea eliminar la compra "${purchaseToDelete.name}" permanentemente?`}</Typography>
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
    createdAt: 'Fecha',
    phone: 'Teléfono',
  };
  const fields = ['fullName', 'createdAt', 'phone'];

  return {
    columns,
    purchaseList,
    purchaseListDetails,
    processing,
    propsModalDeletePurchase,
    propsSearchBarButton,
    searchList,
    setSearchList,
    totalItems,
    labels,
    fields,
    isQuintales,
    toggleUnit,
  };
};

export default usePurchaseList;
