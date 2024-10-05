import { useFormikFields, useMountEffect } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  purchaseDetailCreateAction,
  purchaseDetailUpdateAction,
  clearPurchaseDetailSelected,
} from '../../../../../../store/modules/purchaseDetail';
import { fieldValidations, paymentMethodType } from '@utils';
import { paidMethodCatalogAction } from '../../../../../../store/modules/catalogs';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';

const usePurchaseDetailForm = () => {
  const dispatch = useDispatch();
  const { id_purchase } = useParams();

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
        validations: fieldValidations.required,
      },
      {
        id: '12',
        label: 'Precio',
        name: 'price',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
      },
      // {
      //   id: '13',
      //   label: 'Total',
      //   name: 'total',
      //   gridItem: true,
      //   gridProps: { md: 6 },
      //   inputProps: { maxLength: 10 },
      // },
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

  const handleOnclick = () => {
    const body = { ...formikPurchaseDetail.form.values };
    if (id_purchase && id_purchase !== '0') {
      dispatch(
        purchaseDetailUpdateAction({
          ...body,
          id_purchase_detail: id_purchase,
        })
      );
    } else {
      dispatch(
        purchaseDetailCreateAction({
          ...formikPurchaseDetail.form.values,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            setApsGlobalModalPropsAction({
              open: false,
            })
          );
          dispatch(clearPurchaseDetailSelected());
          formikPurchaseDetail.form.resetForm();
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
