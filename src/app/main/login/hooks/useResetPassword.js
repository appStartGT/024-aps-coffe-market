import React, { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth, useFormikFields } from '@hooks';
import * as yup from 'yup';

const validations = {
  password: yup
    .string()
    .required('Requerido')
    .min(8, 'La contraseña debe contener almenos 8 caracteres')
    .matches(
      //eslint-disable-next-line
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
      'La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial.'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Requerido')
    .min(8, 'La contraseña debe contener almenos 8 caracteres'),
};

export const useResetPassword = () => {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Contraseña',
        name: 'password',
        type: showPassword ? 'text' : 'password',
        gridItem: true,
        gridProps: { md: 12 },
        validations: validations.password,
        onKeyDown: handleKeyDown,
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
        id: '2',
        label: 'Confirmar contraseña',
        name: 'confirm_password',
        type: showConfirmPassword ? 'text' : 'password',
        gridItem: true,
        gridProps: { md: 12 },
        validations: validations.confirmPassword,
        onKeyDown: handleKeyDown,
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setShowConfirmPassword((showPassword) => !showPassword)
                }
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      },
    ],
  });

  function handleKeyDown(event) {
    if (event.key === 'Enter' && formik.form.isValid) {
      event.preventDefault();
      handleResetPassword();
    }
  }

  const handleResetPassword = () => {
    const { password } = formik.form.values;
    auth.resetPassoword({ id_user: auth.user.id_user, password });
  };

  return {
    showPassword,
    formik,
    setShowPassword,
    handleResetPassword,
    loading: auth.loading,
  };
};

export default useResetPassword;
