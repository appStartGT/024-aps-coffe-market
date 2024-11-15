import { useFormikFields, useMountEffect, useUpdateEffect } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  saleDetailCreateAction,
  saleDetailUpdateAction,
  clearSaleDetailSelected,
} from '../../../../../../../../store/modules/saleDetail';
import { fieldValidations, paymentMethodType } from '@utils';
import { paymentMethodCatalogAction } from '../../../../../../../../store/modules/catalogs';
import { setApsGlobalModalPropsAction } from '../../../../../../../../store/modules/main';
import * as Yup from 'yup';

const useSaleDetailForm = (id_sale) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.saleDetail.processing);
  const saleDetailSelected = useSelector(
    (state) => state.saleDetail.saleDetailSelected
  );
  const cat_payment_method = useSelector((state) => state.catalogs.cat_payment_method);

  const formikSaleDetail = useFormikFields({
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
        disabled: () => formikSaleDetail.form.values.isPriceless,
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
      if (saleDetailSelected) {
        formikSaleDetail.form.setValues(saleDetailSelected);
      }
      dispatch(paymentMethodCatalogAction());
    },
    deps: [saleDetailSelected],
  });
  
  useUpdateEffect(() => {
    if (formikSaleDetail.form.values.isPriceless) {
      formikSaleDetail.form.setFieldValue('price', 0);
    } else if (formikSaleDetail.form.values.price === 0) {
      formikSaleDetail.form.setFieldValue('price', '');
    }
  }, [formikSaleDetail.form.values.isPriceless]);

  const handleFormReset = () => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: false,
      })
    );
    dispatch(clearSaleDetailSelected());
    formikSaleDetail.form.resetForm();
  };

  const handleOnclick = (nonupdate) => {
    const body = { ...formikSaleDetail.form.values };
    if (saleDetailSelected?.id_sale_detail) {
      dispatch(
        saleDetailUpdateAction({
          ...body,
          id_sale_detail: saleDetailSelected?.id_sale_detail,
        })
      )
        .unwrap()
        .then(() => {
          handleFormReset();
        });
    } else {
      dispatch(
        saleDetailCreateAction({
          ...formikSaleDetail.form.values,
          id_sale: id_sale,
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
    formikSaleDetail,
    handleOnclick,
    saleDetailSelected,
    loading,
  };
};

export default useSaleDetailForm;
