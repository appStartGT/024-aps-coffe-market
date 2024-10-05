import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  purchaseDetailListAction,
  purchaseDetailDeleteAction,
} from '../../../../../../store/modules/purchaseDetail';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import PurchaseDetailForm from '../components/PurchaseDetailForm';

const usePurchaseDetail = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState([]);
  const purchaseList = useSelector(
    (state) => state.purchaseDetail.purchaseDetailList
  );
  const processing = useSelector((state) => state.purchaseDetail.processing);

  const propsModalDeletePurchase = {
    open: false,
    onClose: () => {},
    onConfirm: (id) => {
      dispatch(purchaseDetailDeleteAction(id));
    },
  };

  useEffect(() => {
    dispatch(purchaseDetailListAction());
  }, [dispatch]);

  const propsSearchBarButton = {
    label: 'Buscar por Nombre / Direccion / Teléfono ',
    type: 'text',
    searchList: purchaseList,
    searchKey: 'name, email, job, address',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () =>
        dispatch(
          setApsGlobalModalPropsAction({
            open: true,
            maxWidth: 'xs',
            title: 'Compra',
            description: 'Registre un nuevo detalle de compra',
            content: <PurchaseDetailForm />,
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
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 110 },
    { field: 'date', headerName: 'Date', width: 150 },
  ];

  return {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    purchaseList,
    propsModalDeletePurchase,
  };
};

export default usePurchaseDetail;
