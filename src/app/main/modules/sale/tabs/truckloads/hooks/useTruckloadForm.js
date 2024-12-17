import React, { useState } from 'react';
import { useFormikFields, useMountEffect, useUpdateEffect } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  truckloadCreateAction,
  truckloadUpdateAction,
  clearTruckloadSelected,
  truckloadUpdateReceivedAction,
} from '../../../../../../store/modules/truckload';
import { fieldValidations, firebaseCollections } from '@utils';
import {
  newOptionModalAction,
  paymentMethodCatalogAction,
} from '../../../../../../store/modules/catalogs';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { saleDetailUpdateSentToBeneficioAction } from '../../../../../../store/modules/saleDetail';
import * as Yup from 'yup';
import ApsFileUpload from '@components/ApsFileUpload';

const useTruckloadForm = (id_sale) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.truckload.processing);
  const truckloadSelected = useSelector(
    (state) => state.truckload.truckloadSelected
  );
  const cat_truckload_license_plate = useSelector(
    (state) => state.catalogs.cat_truckload_license_plate
  );
  const statistics = useSelector((state) => state.sale.statistics);
  const availableForShipment = parseFloat(
    statistics?.availableForShipment?.replace(/,/g, '') || 0
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const handleNewOption = (catalog, inputValue) => {
    const modalProps = {
      open: true,
      inputValue,
      catalog,
    };
    dispatch(newOptionModalAction(modalProps));
  };

  const formikTruckload = useFormikFields({
    fields: [
      {
        id: '5',
        label: 'Placa',
        name: 'id_cat_truckload_license_plate',
        field: 'autocomplete',
        options: cat_truckload_license_plate,
        noOptionsText: 'No hay opciones disponibles.',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        onAddNew: (inputValue) => {
          handleNewOption(
            firebaseCollections.CAT_TRUCKLOAD_LICENSE_PLATE,
            inputValue
          );
        },
        validations: fieldValidations.requiredSelect,
      },
      {
        id: '6',
        label: 'Total libras enviado',
        name: 'totalSent',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: truckloadSelected
          ? Yup.number()
              .required('El total de libras enviado es requerido')
              .typeError('El total enviado debe ser un número')
              .min(1, 'El total enviado debe ser mayor a 0')
              .test(
                'min',
                'El total enviado debe ser mayor o igual al total recibido',
                function (value) {
                  const totalReceived = this.parent.totalReceived;
                  if (!totalReceived) return true;
                  return value >= totalReceived;
                }
              )
          : Yup.number()
              .required('El total de libras enviado es requerido')
              .typeError('El total enviado debe ser un número')
              .min(1, 'El total enviado debe ser mayor a 0')
              .test(
                'max',
                'El total enviado no puede ser mayor que el disponible para envío',
                function (value) {
                  return value <= availableForShipment;
                }
              ),
      },
      {
        id: '7',
        label: 'Total libras recibido',
        name: 'totalReceived',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 10 },
        validations: Yup.number()
          .typeError('El total recibido debe ser un número')
          .min(0, 'El total recibido debe ser mayor o igual a 0')
          .test(
            'max',
            'El total recibido no puede ser mayor que el total enviado',
            function (value) {
              const totalSent = this.parent.totalSent;
              if (!value) return true;
              return value <= totalSent;
            }
          ),
      },
      {
        id: '4',
        gridItem: true,
        field: 'custom',
        children: (
          <ApsFileUpload
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
      // console.log('useMountEffect');
      // dispatch(truckloadUpdateReceivedAction());

      if (truckloadSelected) {
        formikTruckload.form.setValues(truckloadSelected);
        setSelectedFile(truckloadSelected.colilla?.metadata);
      }
      dispatch(paymentMethodCatalogAction());
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

    // Calculate if availableForShipment will be 0 after this truckload
    const remainingShipment =
      availableForShipment - Number(body.totalSent || 0);
    const willBeZero = remainingShipment === 0;

    if (truckloadSelected?.id_beneficio_truckload) {
      dispatch(
        truckloadUpdateAction({
          ...body,
          id_beneficio_truckload: truckloadSelected?.id_beneficio_truckload,
        })
      )
        .unwrap()
        .then(() => {
          if (willBeZero) {
            dispatch(saleDetailUpdateSentToBeneficioAction());
            dispatch(truckloadUpdateReceivedAction());
          }
          handleFormReset();
        });
    } else {
      dispatch(
        truckloadCreateAction({
          ...formikTruckload.form.values,
          id_sale: id_sale,
          nonupdate,
          // availableForShipmentWillBeZero: willBeZero
        })
      )
        .unwrap()
        .then(() => {
          if (willBeZero) {
            dispatch(saleDetailUpdateSentToBeneficioAction());
            dispatch(truckloadUpdateReceivedAction());
          }
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
