import ApsForm from '@components/ApsForm';
import usePurchaseDetailForm from '../hooks/usePurchaseDetailForm';
import { FormControlLabel, Switch, Typography, Box } from '@mui/material';
import ApsButton from '@components/ApsButton';

const PurchaseDetailForm = () => {
  const { formikPurchaseDetail, handleOnclick, calculateTotal } =
    usePurchaseDetailForm();
  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <FormControlLabel
          control={
            <Switch
              // checked={formikPurchaseDetail.form.values.isPriceless}
              onChange={(event) =>
                formikPurchaseDetail.form.setFieldValue(
                  'isPriceless',
                  event.target.checked
                )
              }
              name="isPriceless"
              value={formikPurchaseDetail.form.values.isPriceless}
            />
          }
          label="Sin precio"
        />
        <Typography variant="h6">Total: Q{calculateTotal()}</Typography>
      </Box>
      <ApsForm formik={formikPurchaseDetail} />

      <ApsButton
        onClick={handleOnclick}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!formikPurchaseDetail.form.isValid}
      >
        Comprar
      </ApsButton>
    </Box>
  );
};

export default PurchaseDetailForm;
