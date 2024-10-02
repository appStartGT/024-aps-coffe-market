import React, { useState } from 'react';
import { useFormikFields, useMountEffect } from '@hooks';
import { LocationOn, Phone, RecentActors } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  branchCreateAction,
  branchUpdateAction,
} from '../../../../store/modules/branch/index';
import { fieldValidations } from '@utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Email from '@mui/icons-material/Email';
import ApsFileUpload from '@components/ApsFileUpload';

const useOrganizationDetailForm = ({ navigate }) => {
  /* HOOKS */
  const dispatch = useDispatch();
  const { id_branch, id_organization } = useParams();
  /* SELECTORS */
  const loading = useSelector((state) => state.branch.processing);
  const branchSelected = useSelector((state) => state.branch.branchSelected);
  const [selectedFile, setSelectedFile] = useState(null);

  const formikBranch = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre de la sucursal',
        name: 'name',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '11',
        gridItem: true,
        field: 'custom',
        gridProps: { md: 6 },
        children: (
          <ApsFileUpload
            label="Logo de la sucursal."
            accept="image/png,image/jpg,image/jpeg,image/gif"
            onChange={(file) => {
              formikBranch.form.setFieldValue('photo', file);
              setSelectedFile(file);
            }}
            value={selectedFile}
          />
        ),
      },
      {
        id: '10',
        label: 'Correo electrónico',
        name: 'email',
        gridItem: true,
        gridProps: { md: 6 },
        validations: fieldValidations.emailRequired,
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
        name: 'telephone',
        gridItem: true,
        validations: fieldValidations.telephoneRequired,
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
        id: '8',
        label: 'Dirección',
        name: 'address',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { maxLength: 255 },
        validations: fieldValidations.requiredCustom(
          'La dirección es requerida.'
        ),
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <LocationOn />
            </InputAdornment>
          ),
        },
      },
      {
        id: '13',
        label: 'Descripción',
        name: 'description',
        gridItem: true,
        multiline: true,
        rows: 4,
        gridProps: { md: 12 },
        inputProps: { maxLength: 3000 },
        validations: fieldValidations.description,
      },
    ],
  });

  useMountEffect({
    effect: () => {
      if (branchSelected) {
        formikBranch.form.setValues(branchSelected);
        setSelectedFile({
          ...branchSelected?.file,
          photo: branchSelected?.photo,
        });
      }
    },
    deps: [branchSelected],
  });

  const handleOnclick = () => {
    if (id_branch != 0) {
      let body = { ...formikBranch.form.values };
      dispatch(
        branchUpdateAction({
          id_branch: id_branch,
          ...body,
        })
      );
    } else {
      dispatch(
        branchCreateAction({
          ...formikBranch.form.values,
          id_organization,
        })
      )
        .unwrap()
        .then((data) => {
          navigate(
            `/main/organization/detail/${id_organization}/branch/${data.id_branch}`
          );
        });
    }
  };

  return {
    formikBranch,
    handleOnclick,
    branchSelected,
    loading,
  };
};

export default useOrganizationDetailForm;
