import * as yup from 'yup';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth, useFormikFields, useUpdateEffect } from '@hooks';
import {
  setFormModalAction,
  changePasswordAction,
} from '../../../../store/modules/settings';

const validations = {
  password: yup
    .string()
    .required('New Password is required')
    .min(8, 'New Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
    .min(8, 'Password must be at least 8 characters'),
};

export const useChangePassword = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const currentModal = useSelector((state) => state.settings.currentModal);
  const processing = useSelector((state) => state.settings.processing);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'New Password',
        name: 'password',
        type: showPassword ? 'text' : 'password',
        gridItem: true,
        gridProps: { md: 12 },
        validations: validations.password,
        // onKeyDown: handleKeyDown,
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
        label: 'Confirm password',
        name: 'confirm_password',
        type: showConfirmPassword ? 'text' : 'password',
        gridItem: true,
        gridProps: { md: 12 },
        validations: validations.confirmPassword,
        // onKeyDown: handleKeyDown,
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

  useUpdateEffect(() => {
    if (!currentModal) {
      formik.form.resetForm();
      formik.form.validateForm({});
    }
  }, [currentModal]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleChangePassword();
    }
  };

  const handleChangePassword = () => {
    const { password } = formik.form.values;
    dispatch(changePasswordAction({ id_user: auth.user?.id_user, password }));
  };

  const setCurrentModal = (modalName) =>
    dispatch(setFormModalAction(modalName));

  const onClose = () => {
    setCurrentModal('');
    formik.clearForm();
  };

  return {
    setShowPassword,
    handleChangePassword,
    setCurrentModal,
    onClose,
    handleKeyDown,
    showPassword,
    formik,
    currentModal,
    processing,
  };
};

export default useChangePassword;
