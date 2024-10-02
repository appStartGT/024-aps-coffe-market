import React, { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';
import * as yup from 'yup';
import { useAuth, useFormikFields } from '@hooks';

export const useRecoveryPassword = () => {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Email',
        name: 'email',
        gridItem: true,
        gridProps: { md: 12 },
        validations: yup
          .string()
          .email('Invalid email address')
          .required('Email is required'),
        onKeyDown: handleKeyDown,
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        },
      },
    ],
  });

  function handleKeyDown(event) {
    if (event.key === 'Enter' && formik.form.isValid) {
      event.preventDefault();
      handleRecovery();
    }
  }

  const handleRecovery = () => {
    const { email } = formik.form.values;
    auth.recoveryPassword({ email });
  };

  return {
    showPassword,
    formik,
    setShowPassword,
    handleRecovery,
    loading: auth.loading,
  };
};

export default useRecoveryPassword;
