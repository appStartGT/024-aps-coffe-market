import { useFormikFields, useMountEffect } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  purchaseDetailCreateAction,
  purchaseDetailUpdateAction,
  clearPurchaseDetailSelected,
} from '../../../../../../store/modules/purchaseDetail';
import { fieldValidations, paymentMethodType } from '@utils';
import { paidMethodCatalogAction } from '../../../../../../store/modules/catalogs';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';

const usePurchaseDetailForm = (id_purchase) => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.purchaseDetail.processing);
  const purchaseDetailSelected = useSelector(
    (state) => state.purchaseDetail.purchaseDetailSelected
  );
  const paidMethod = useSelector((state) => state.catalogs.paidMethod);

  const formikPurchaseDetail = useFormikFields({
    fields: [
      {
        id: '11',
        label: 'Libras',
        name: 'quantity',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: fieldValidations.numberRequired,
      },
      {
        id: '12',
        label: 'Precio',
        name: 'price',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: fieldValidations.numberRequired,
      },
      {
        id: '15',
        label: 'Forma de Pago',
        name: 'id_cat_payment_method',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { maxLength: 10 },
        field: 'select',
        options: paidMethod,
        value: paymentMethodType.CASH,
      },
      {
        id: '16',
        label: 'Anticipos',
        name: 'advancePayments',
        gridItem: true,
        gridProps: { md: 12 },
        renderfunction: () => false,
        value: [],
      },
    ],
  });

  useMountEffect({
    effect: () => {
      if (purchaseDetailSelected) {
        formikPurchaseDetail.form.setValues(purchaseDetailSelected);
      }
      dispatch(paidMethodCatalogAction());
    },
    deps: [purchaseDetailSelected],
  });

  const handleFormReset = () => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: false,
      })
    );
    dispatch(clearPurchaseDetailSelected());
    formikPurchaseDetail.form.resetForm();
  };

  const handleOnclick = (nonupdate) => {
    const body = { ...formikPurchaseDetail.form.values };
    if (purchaseDetailSelected?.id_purchase_detail) {
      dispatch(
        purchaseDetailUpdateAction({
          ...body,
          id_purchase_detail: purchaseDetailSelected?.id_purchase_detail,
        })
      )
        .unwrap()
        .then(() => {
          handleFormReset();
        });
    } else {
      dispatch(
        purchaseDetailCreateAction({
          ...formikPurchaseDetail.form.values,
          id_purchase: id_purchase,
          nonupdate,
        })
      )
        .unwrap()
        .then(() => {
          handleFormReset();
        });
    }
  };

  return {
    formikPurchaseDetail,
    handleOnclick,
    purchaseDetailSelected,
    loading,
  };
};

export default usePurchaseDetailForm;
