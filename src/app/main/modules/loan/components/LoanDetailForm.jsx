import React from 'react';
import { Save } from '@mui/icons-material';
import { Box } from '@mui/material';
import ApsForm from '@components/ApsForm';
import ApsButton from '@components/ApsButton';
import useLoanForm from '../hooks/useLoanForm';

const LoanDetailForm = ({ nonupdate, id_purchase }) => {
  const { formikLoan, handleOnClick, processing } = useLoanForm(id_purchase);
  return (
    <>
      <ApsForm formik={formikLoan} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <ApsButton
          onClick={handleOnClick}
          startIcon={<Save />}
          variant="contained"
          color="primary"
          disabled={!formikLoan.form.isValid || processing}
        >
          {nonupdate ? 'Guardar' : 'Actualizar'}
        </ApsButton>
      </Box>
    </>
  );
};

export default LoanDetailForm;
