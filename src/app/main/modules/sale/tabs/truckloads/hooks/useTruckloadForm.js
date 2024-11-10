import React, { useState } from 'react';
import { useFormikFields, useMountEffect, useUpdateEffect } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  truckloadCreateAction,
  truckloadUpdateAction,
  clearTruckloadSelected,
} from '../../../../../../store/modules/truckload';
import { fieldValidations } from '@utils';
import { paidMethodCatalogAction } from '../../../../../../store/modules/catalogs';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import * as Yup from 'yup';
import ApsFileUpload from '@components/ApsFileUpload';

const useTruckloadForm = (id_sale) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.truckload.processing);
  const truckloadSelected = useSelector(
    (state) => state.truckload.truckloadSelected
  );
  const catTruckloadLicensePlate = useSelector(
    (state) => state.catalogs.catTruckloadLicensePlate
  );

  const [selectedFile, setSelectedFile] = useState(null);

  const formikTruckload = useFormikFields({
    fields: [
      {
        id: '5',
        label: 'Placa',
        name: 'id_cat_truckload_license_plate',
        field: 'select',
        options: catTruckloadLicensePlate,
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: Yup.string().required('La placa es requerida'),
      },
      {
        id: '6',
        label: 'Total libras enviado',
        name: 'totalSent',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: fieldValidations.numberRequired,
      },
      {
        id: '7',
        label: 'Total libras recibido',
        name: 'totalReceived',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: fieldValidations.number,
      },
      {
        id: '4',
        gridItem: true,
        field: 'custom',
        children: (
          <ApsFileUpload
            // required
            label="Colilla"
            accept="image/png,image/jpg,image/jpeg,image/gif"
            onChange={(file) => {
              formikTruckload.form.setFieldValue('colilla', file);
              setSelectedFile(file);
            }}
            value={selectedFile}
            maxSizeMB={5}
          />
        ),
      },
    ],
  });

  useMountEffect({
    effect: () => {
      if (truckloadSelected) {
        formikTruckload.form.setValues(truckloadSelected);
        setSelectedFile(truckloadSelected.colilla?.metadata);
      }
      dispatch(paidMethodCatalogAction());
    },
    deps: [truckloadSelected],
  });
  useUpdateEffect(() => {
    if (formikTruckload.form.values.isPriceless) {
      formikTruckload.form.setFieldValue('price', 0);
    } else if (formikTruckload.form.values.price === 0) {
      formikTruckload.form.setFieldValue('price', '');
    }
  }, [formikTruckload.form.values.isPriceless]);

  const handleFormReset = () => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: false,
      })
    );
    dispatch(clearTruckloadSelected());
    formikTruckload.form.resetForm();
  };

  const handleOnclick = (nonupdate) => {
    const body = { ...formikTruckload.form.values };
    if (truckloadSelected?.id_beneficio_truckload) {
      dispatch(
        truckloadUpdateAction({
          ...body,
          id_beneficio_truckload: truckloadSelected?.id_beneficio_truckload,
        })
      )
        .unwrap()
        .then(() => {
          handleFormReset();
        });
    } else {
      dispatch(
        truckloadCreateAction({
          ...formikTruckload.form.values,
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
    formikTruckload,
    handleOnclick,
    truckloadSelected,
    loading,
  };
};

export default useTruckloadForm;
