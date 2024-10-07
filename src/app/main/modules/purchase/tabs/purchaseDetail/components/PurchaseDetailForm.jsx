import React from 'react';
import ApsForm from '@components/ApsForm';
import usePurchaseDetailForm from '../hooks/usePurchaseDetailForm';
import { FormControlLabel, Switch, Typography, Box } from '@mui/material';
import ApsButton from '@components/ApsButton';
import { formatNumber } from '@utils';
// import ApsModalLoading from '@components/ApsModalLoading';
import AdvancePayment from './AdvancePayment';

const PurchaseDetailForm = ({ id_purchase, nonupdate }) => {
  const { formikPurchaseDetail, handleOnclick, loading } =
    usePurchaseDetailForm(id_purchase);

  return (
    <Box display="flex" flexDirection="column">
      {/* <ApsModalLoading open={loading} message="Procesando compra..." /> */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(formikPurchaseDetail.form.values.isPriceless)}
              onChange={(event) =>
                formikPurchaseDetail.form.setFieldValue(
                  'isPriceless',
                  event.target.checked
                )
              }
              name="isPriceless"
            />
          }
          label="Sin precio"
          sx={{ width: '100%' }}
        />
        <Typography variant="h6" textAlign="end" width="100%">
          Total a pagar Q
          {(() => {
            const total =
              formikPurchaseDetail.form.values.quantity *
              formikPurchaseDetail.form.values.price;
            const advancePayments =
              formikPurchaseDetail.form.values.advancePayments || [];
            const totalAdvances = advancePayments.reduce(
              (sum, payment) => sum + (payment.amount || 0),
              0
            );
            const result = total - totalAdvances;
            return isNaN(result) ? '0.00' : formatNumber(result);
          })()}
        </Typography>
      </Box>
      <ApsForm formik={formikPurchaseDetail} />
      <AdvancePayment formikPurchaseDetail={formikPurchaseDetail} />
      <ApsButton
        onClick={() => handleOnclick(nonupdate)}
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
