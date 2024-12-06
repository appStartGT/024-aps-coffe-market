import React, { useMemo } from 'react';
import ApsForm from '@components/ApsForm';
import usePurchaseDetailForm from '../hooks/usePurchaseDetailForm';
import {
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import ApsButton from '@components/ApsButton';
import { formatNumber } from '@utils';
// import ApsModalLoading from '@components/ApsModalLoading';
import AdvancePayment from './AdvancePayment';

const PurchaseDetailForm = ({ id_purchase, nonupdate }) => {
  const { formikPurchaseDetail, handleOnclick, loading, currentBudget } =
    usePurchaseDetailForm(id_purchase);

  const disableSwitch = useMemo(() => {
    return (
      formikPurchaseDetail.form.values.isPriceless &&
      formikPurchaseDetail.form.values.advancePayments &&
      formikPurchaseDetail.form.values.advancePayments.length > 0
    );
  }, [
    formikPurchaseDetail.form.values.isPriceless,
    formikPurchaseDetail.form.values.advancePayments,
  ]);

  const calculateTotalToPay = () => {
    const total =
      formikPurchaseDetail.form.values.quantity *
      formikPurchaseDetail.form.values.price;
    const advancePayments =
      formikPurchaseDetail.form.values.advancePayments || [];
    const totalAdvances = advancePayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    return total - totalAdvances;
  };

  const handlePayTotal = () => {
    const remainingTotal = calculateTotalToPay();
    if (remainingTotal > 0) {
      const newPayment = {
        amount: remainingTotal,
        createdAt: new Date().toISOString(),
      };
      const updatedAdvancePayments = [
        ...(formikPurchaseDetail.form.values.advancePayments || []),
        newPayment,
      ];
      formikPurchaseDetail.form.setFieldValue(
        'advancePayments',
        updatedAdvancePayments
      );
    }
  };
  console.log(formikPurchaseDetail.form.values);
  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
        mb={2}
      >
        {!formikPurchaseDetail.form.values.budgetIsClosed &&
          formikPurchaseDetail.form.values.id_budget ===
            currentBudget?.id_budget && (
            <Box display="flex" flexDirection="column" width="100%">
              {!formikPurchaseDetail.form.values.isPriceless && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(
                        formikPurchaseDetail.form.values.isPendingPayment
                      )}
                      onChange={(event) =>
                        formikPurchaseDetail.form.setFieldValue(
                          'isPendingPayment',
                          event.target.checked
                        )
                      }
                      name="isPendingPayment"
                    />
                  }
                  label="Pendiente de pago"
                  sx={{ width: '100%' }}
                />
              )}
              <Tooltip
                title={
                  disableSwitch
                    ? 'Para habilitar esta opción elimine los anticipos'
                    : ''
                }
                arrow
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(
                        formikPurchaseDetail.form.values.isPriceless
                      )}
                      onChange={(event) => {
                        formikPurchaseDetail.form.setFieldValue(
                          'isPriceless',
                          event.target.checked
                        );

                        formikPurchaseDetail.form.setFieldValue(
                          'isPendingPayment',
                          false
                        );
                      }}
                      name="isPriceless"
                      // disabled={disableSwitch}
                    />
                  }
                  label="Sin precio"
                  sx={{ width: '100%' }}
                />
              </Tooltip>
            </Box>
          )}
        <Typography variant="h6" textAlign="end" width="100%">
          {formikPurchaseDetail.form.values.isPriceless ? (
            <>
              Anticipos Q
              {(() => {
                const advancePayments =
                  formikPurchaseDetail.form.values.advancePayments || [];
                const totalAdvances = advancePayments.reduce(
                  (sum, payment) => sum + (payment.amount || 0),
                  0
                );
                return formatNumber(totalAdvances);
              })()}
            </>
          ) : (
            <Box display="flex" justifyContent="center">
              {calculateTotalToPay() < 0 ? (
                <>Anticipos Q{formatNumber(Math.abs(calculateTotalToPay()))}</>
              ) : (
                <>Total a pagar Q{formatNumber(calculateTotalToPay())}</>
              )}
            </Box>
          )}
        </Typography>
      </Box>
      <ApsForm formik={formikPurchaseDetail} />
      <AdvancePayment
        formikPurchaseDetail={formikPurchaseDetail}
        id_purchase={
          formikPurchaseDetail.form?.values?.isPriceless ? null : id_purchase
        }
        handlePayTotal={handlePayTotal}
      />
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
