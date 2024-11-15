import { useFormikFields, useMountEffect, useUpdateEffect } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  purchaseDetailCreateAction,
  purchaseDetailUpdateAction,
  clearPurchaseDetailSelected,
} from '../../../../../../store/modules/purchaseDetail';
import { fieldValidations, paymentMethodType } from '@utils';
import { paymentMethodCatalogAction } from '../../../../../../store/modules/catalogs';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import * as Yup from 'yup';
import { useEffect } from 'react';

const usePurchaseDetailForm = (id_purchase) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.purchaseDetail.processing);
  const purchaseDetailSelected = useSelector(
    (state) => state.purchaseDetail.purchaseDetailSelected
  );
  const cat_payment_method = useSelector(
    (state) => state.catalogs.cat_payment_method
  );

  const formikPurchaseDetail = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Libras',
        name: 'quantity',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: fieldValidations.numberRequired,
      },
      {
        id: '2',
        label: 'Precio',
        name: 'price',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: Yup.number().when('isPriceless', {
          is: true,
          then: Yup.number()
            .notRequired()
            .typeError('El precio debe ser un número'),
          otherwise: Yup.number()
            .typeError('El precio debe ser un número')
            .required('El precio es requerido'),
        }),
        disabled: () => formikPurchaseDetail.form.values.isPriceless,
      },
      {
        id: '3',
        label: 'Forma de Pago',
        name: 'id_cat_payment_method',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { maxLength: 10 },
        field: 'select',
        options: cat_payment_method,
        value: paymentMethodType.CASH,
      },
      {
        id: '4',
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
    },
    deps: [purchaseDetailSelected],
  });
  //get catalog paid method
  useEffect(() => {
    dispatch(paymentMethodCatalogAction());
  }, []);

  useUpdateEffect(() => {
    if (formikPurchaseDetail.form.values.isPriceless) {
      formikPurchaseDetail.form.setFieldValue('price', 0);
    } else if (formikPurchaseDetail.form.values.price === 0) {
      formikPurchaseDetail.form.setFieldValue('price', '');
    }
  }, [formikPurchaseDetail.form.values.isPriceless]);

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
