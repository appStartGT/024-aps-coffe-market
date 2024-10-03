import React, { useState, useEffect } from 'react';
import { useAuth, useFormikFields, useMountEffect } from '@hooks';
import { LocationOn, Phone, RecentActors } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  purchaseCreateAction,
  purchaseUpdateAction,
} from '../../../../store/modules/purchase';
import { fieldValidations } from '@utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Email from '@mui/icons-material/Email';

const usePurchaseForm = ({ navigate }) => {
  /* HOOKS */
  const dispatch = useDispatch();
  const { id_purchase } = useParams();
  const auth = useAuth();

  /* SELECTORS */
  const loading = useSelector((state) => state.purchase.processing);
  const purchaseSelected = useSelector(
    (state) => state.purchase.purchaseSelected
  );

  const formikPurchase = useFormikFields({
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
        id: '2',
        label: 'Apellidos',
        name: 'surNames',
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
        gridProps: { md: 3 },
        // validations: fieldValidations.emailRequired,
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
        // validations: fieldValidations.telephoneRequired,
        gridProps: { md: 3 },
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
        gridProps: { md: 3 },
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
        gridProps: { md: 3 },
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
        // validations: fieldValidations.requiredCustom(
        //   'La dirección es requerida.'
        // ),
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
      if (purchaseSelected) {
        formikPurchase.form.setValues(purchaseSelected);
      }
    },
    deps: [purchaseSelected],
  });

  const handleOnclick = () => {
    if (id_purchase && id_purchase !== '0') {
      let body = { ...formikPurchase.form.values };
      dispatch(
        purchaseUpdateAction({
          ...body,
          id_purchase: id_purchase,
        })
      );
    } else {
      dispatch(
        purchaseCreateAction({
          ...formikPurchase.form.values,
        })
      )
        .unwrap()
        .then((data) => {
          navigate(`/main/purchase/detail/${data.id_purchase}`);
        });
    }
  };

  return {
    formikPurchase,
    handleOnclick,
    purchaseSelected,
    loading,
  };
};

export default usePurchaseForm;
