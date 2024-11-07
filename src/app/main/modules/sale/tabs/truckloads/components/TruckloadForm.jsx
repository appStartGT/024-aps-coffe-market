import React, { useMemo } from 'react';
import ApsForm from '@components/ApsForm';
import useTruckloadForm from '../hooks/useTruckloadForm';
import { Box } from '@mui/material';
import ApsButton from '@components/ApsButton';

const TruckloadForm = ({ id_sale, nonupdate }) => {
  const { formikTruckload, handleOnclick, loading } = useTruckloadForm(id_sale);

  return (
    <Box display="flex" flexDirection="column">
      <ApsForm formik={formikTruckload} />
      <ApsButton
        onClick={() => handleOnclick(nonupdate)}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!formikTruckload.form.isValid || loading}
      >
        Guardar
      </ApsButton>
    </Box>
  );
};

export default TruckloadForm;
