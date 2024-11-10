import React from 'react';
import { useFormikFields, useMountEffect } from '@hooks';
import { LocationOn, Phone, RecentActors } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  saleCreateAction,
  saleUpdateAction,
  saleDeleteAction,
} from '../../../../store/modules/sale';
import { fieldValidations } from '@utils';
import { useParams } from 'react-router-dom';
import Email from '@mui/icons-material/Email';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';

const useSaleForm = ({ navigate }) => {
  /* HOOKS */
  const dispatch = useDispatch();
  const { id_sale } = useParams();

  /* SELECTORS */
  const loading = useSelector((state) => state.sale.processing);
  const saleSelected = useSelector((state) => state.sale.saleSelected);

  const formikSale = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre',
        name: 'name',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '10',
        label: 'Correo electrónico',
        name: 'email',
        gridItem: true,
        gridProps: { md: 6 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        },
      },
      {
        id: '3',
        label: 'Teléfono',
        name: 'phone',
        gridItem: true,
        gridProps: { md: 4 },
        inputProps: { maxLength: 8 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Phone />
            </InputAdornment>
          ),
        },
      },
      {
        id: '5',
        label: 'NIT',
        name: 'nit',
        gridItem: true,
        gridProps: { md: 4 },
        inputProps: { maxLength: 20 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <RecentActors />
            </InputAdornment>
          ),
        },
      },
      {
        id: '6',
        label: 'DPI',
        name: 'DPI',
        gridItem: true,
        gridProps: { md: 4 },
        inputProps: { maxLength: 20 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <RecentActors />
            </InputAdornment>
          ),
        },
      },
      {
        id: '8',
        label: 'Dirección',
        name: 'address',
        gridItem: true,
        gridProps: { md: 12 },
        multiline: true,
        rows: 4,
        inputProps: { maxLength: 255 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <LocationOn />
            </InputAdornment>
          ),
        },
      },
    ],
  });

  useMountEffect({
    effect: () => {
      if (saleSelected) {
        formikSale.form.setValues(saleSelected);
      }
    },
    deps: [saleSelected],
  });

  const handleOnclick = () => {
    if (id_sale && id_sale !== '0') {
      let body = { ...formikSale.form.values };
      dispatch(
        saleUpdateAction({
          ...body,
          id_sale: id_sale,
        })
      );
    } else {
      dispatch(
        saleCreateAction({
          ...formikSale.form.values,
        })
      )
        .unwrap()
        .then((data) => {
          navigate(`/main/sale/detail/${data.id_sale}`);
        });
    }
  };

  const handleDelete = async () => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: 'Eliminar Venta',
        description: '¿Está seguro que desea eliminar esta venta?',
        content: null,
        handleOk: () => {
          dispatch(saleDeleteAction({ id_sale }))
            .unwrap()
            .then(() => {
              navigate('/main/sale');
              dispatch(setApsGlobalModalPropsAction({ open: false }));
            });
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
    formikSale,
    handleOnclick,
    handleDelete,
    saleSelected,
    loading,
  };
};

export default useSaleForm;
