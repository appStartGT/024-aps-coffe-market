import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useFormikFields, useMountEffect } from '@hooks';
import ApsFileUpload from '@components/ApsFileUpload';
import { activeSelectOptions, fieldValidations } from '@utils';
import {
  createUserAction,
  setUserAction,
  setUserModalAction,
  updateUserAction,
} from '../../../../store/modules/user';
import { rolesCatalogAction } from '../../../../store/modules/catalogs';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import moment from 'moment';

const useCreateUserForm = ({ id_user_type, id_organization, id_branch }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const processing = useSelector((state) => state.user.processing);
  const isUserModalOpen = useSelector((state) => state.user.isUserModalOpen);
  const roles = useSelector((state) => state.catalogs.roles);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  console.log(roles);
  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombres',
        name: 'names',
        gridItem: true,
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '2',
        label: 'Apellidos',
        name: 'surNames',
        gridItem: true,
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '3',
        label: 'Correo electrónico',
        name: 'email',
        gridItem: true,
        InputProps: {
          autoComplete: 'off  ',
        },
        inputProps: { maxLength: 100 },
        validations: fieldValidations.emailRequired,
      },
      {
        id: '4',
        label: 'Rol',
        name: 'id_role',
        field: 'autocomplete',
        gridItem: true,
        options: roles,
        validations: fieldValidations.requiredSelect,
      },
      {
        id: '5',
        label: 'Contraseña',
        name: 'password',
        type: showPassword ? 'text' : 'password',
        gridItem: true,
        validations: yup
          .string()
          .when('id_user', (id_user, schema) =>
            id_user
              ? schema.min(8, 'al menos 8 caracteres')
              : schema.min(8, 'al menos 8 caracteres').required('Requerido')
          ),
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((showPassword) => !showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      },
      {
        id: '6',
        label: 'Teléfono',
        name: 'phone',
        gridItem: true,
        inputProps: { maxLength: 20 },
      },
      {
        id: '7',
        label: 'DPI',
        name: 'DPI',
        gridItem: true,
        inputProps: { maxLength: 20 },
        validations: yup
          .string()
          // .required('Requerido')
          .min(13, 'Debe contener almenos 13 caracteres'),
      },
      {
        id: '8',
        label: 'NIT',
        name: 'NIT',
        inputProps: { maxLength: 20 },
        gridItem: true,
      },
      {
        id: '9',
        label: 'Fecha de nacimiento',
        name: 'dateOfBirth',
        field: 'datePicker',
        gridItem: true,
        validations: fieldValidations.dateValidation({
          min: '1900-01-01',
          max: moment(),
          // required: true,
        }),
      },
      {
        id: '10',
        label: 'Dirección',
        name: 'address',
        gridItem: true,
        inputProps: { maxLength: 255 },
      },
      {
        id: '11',
        gridItem: true,
        field: 'custom',
        children: (
          <ApsFileUpload
            label="Sube tu foto de perfil."
            accept="image/png,image/jpg,image/jpeg,image/gif"
            onChange={(file) => {
              formik.form.setFieldValue('photo', file);
              setSelectedFile(file);
            }}
            value={selectedFile}
            maxSizeMB={5}
          />
        ),
      },
      {
        id: '12',
        label: 'Estado',
        name: 'isActive',
        field: 'select',
        gridItem: true,
        options: activeSelectOptions,
        value: true,
      },
      // {
      //   id: '13',
      //   label: 'Usuario asistente',
      //   name: 'userAssistant',
      //   gridItem: true,
      //   field: 'autocomplete',
      //   options: fileteredUserCatalog,
      //   value: [],
      //   multiple: true,
      //   freeSolo: true,
      //   gridProps: { md: 12 },
      // },
    ].filter((e) => e),
  });

  useMountEffect({
    effect: () => dispatch(rolesCatalogAction()),
  });

  useEffect(() => {
    if (selectedUser && Object.keys(selectedUser).length) {
      formik.form.setValues({ ...selectedUser, password: '' }); //validate whether the password should be displayed
      setSelectedFile({
        ...selectedUser?.photoMetadata,
        photo: selectedUser?.photo,
      });
    } else {
      formik.clearForm();
      setSelectedFile(null);
    }
  }, [selectedUser]);

  const handleOnclick = () => {
    if (selectedUser && selectedUser.id_user) {
      console.log(formik.form.values);
      //update
      dispatch(
        updateUserAction({
          ...formik.form.values,
          // roles: [formik.form.values.id_role],
          id_user: selectedUser.id_user,
          id_user_type,
          id_organization,
          id_branch,
          id_role: formik.form.values?.id_role?.value,
        })
      );
    } else {
      dispatch(
        createUserAction({
          ...formik.form.values,
          id_role: formik.form.values.id_role?.value,
          id_user_type,
          id_organization,
          id_branch,
        })
      );
    }
  };

  const onClose = () => {
    dispatch(setUserAction(null));
    dispatch(setUserModalAction(false));
    setSelectedFile(null);
  };

  return {
    handleOnclick,
    onClose,
    formik,
    processing,
    isUserModalOpen,
    selectedUser,
  };
};

export default useCreateUserForm;
