import ApsForm from '@components/ApsForm';
import usePurchaseDetailForm from '../hooks/usePurchaseDetailForm';
import { FormControlLabel, Switch, Typography, Box } from '@mui/material';
import ApsButton from '@components/ApsButton';
import { calculateTotal } from '@utils';

const PurchaseDetailForm = ({ id_purchase }) => {
  const { formikPurchaseDetail, handleOnclick, loading } =
    usePurchaseDetailForm(id_purchase);
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
        <Typography variant="h6">
          Total: Q
          {calculateTotal(
            formikPurchaseDetail.form.values.quantity,
            formikPurchaseDetail.form.values.price
          )}
        </Typography>
      </Box>
      <ApsForm formik={formikPurchaseDetail} />

      <ApsButton
        onClick={handleOnclick}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!formikPurchaseDetail.form.isValid || loading}
      >
        Comprar
      </ApsButton>
    </Box>
  );
};

export default PurchaseDetailForm;
