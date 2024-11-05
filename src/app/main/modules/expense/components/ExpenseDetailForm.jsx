import React from 'react';
import { Save } from '@mui/icons-material';
import { Box } from '@mui/material';
import ApsForm from '@components/ApsForm';
import ApsButton from '@components/ApsButton';
import useExpenseForm from '../hooks/usePurchaseForm';

const ExpenseDetailForm = ({ nonupdate }) => {
  const { formikExpense, handleOnclick, processing } = useExpenseForm();

  return (
    <>
      <ApsForm formik={formikExpense} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <ApsButton
          onClick={handleOnclick}
          startIcon={<Save />}
          variant="contained"
          color="primary"
          disabled={!formikExpense.form.isValid || processing}
        >
          {nonupdate ? 'Guardar' : 'Actualizar'}
        </ApsButton>
      </Box>
    </>
  );
};

export default ExpenseDetailForm;
