import React, { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import { useAuth, useFormikFields } from '@hooks';
import { fieldValidations } from '@utils';

export const useLogin = () => {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Correo electrónico',
        name: 'email',
        gridItem: true,
        gridProps: { md: 12 },
        validations: fieldValidations.dpiEmail,
        onKeyDown: handleKeyDown,
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        },
      },
      {
        id: '2',
        label: 'Contraseña',
        name: 'password',
        type: showPassword ? 'text' : 'password',
        gridItem: true,
        gridProps: { md: 12 },
        validations: fieldValidations.password,
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
    ],
  });

  function handleKeyDown(event) {
    if (event.key === 'Enter' && formik.form.isValid) {
      event.preventDefault();
      handleLogin();
    }
  }

  const handleLogin = () => {
    auth.login(formik.form.values);
  };

  return {
    showPassword,
    formik,
    setShowPassword,
    handleLogin,
    loading: auth.loading,
  };
};

export default useLogin;
