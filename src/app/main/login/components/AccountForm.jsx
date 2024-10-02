import React from 'react';
import { Button, Typography } from '@mui/material';
import ApsForm from '@components/ApsForm';
import ApsInfoAlert from '@components/ApsInfoAlert';

const AccountForm = ({
  label,
  labelClick,
  submitText,
  handleClick,
  formik,
  loading,
  alertProps,
}) => {
  return (
    <>
      {alertProps && (
        <ApsInfoAlert text="This is an example text " {...alertProps} />
      )}

      <ApsForm formik={formik} />
      <Button
        onClick={handleClick}
        disabled={
          !formik.form.isValid ||
          !Object.values(formik.form.values).every((e) => e) ||
          loading
        }
        fullWidth
        variant="contained"
        sx={{
          mt: '36px',
          borderRadius: '8px',
          height: '40px',
        }}
      >
        <Typography>{submitText}</Typography>
      </Button>
      {label && (
        <Typography
          variant="overline"
          color="primary"
          width={'100%'}
          marginTop={'12px'}
          fontSize={'14px'}
          textTransform={'none'}
          onClick={labelClick}
          sx={{
            cursor: 'pointer',
          }}
        >
          {label}
        </Typography>
      )}
    </>
  );
};

export default AccountForm;
