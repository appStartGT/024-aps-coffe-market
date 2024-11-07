import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ApsForm from '@components/ApsForm';
import ApsButton from '@components/ApsButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatNumber } from '@utils';
import moment from 'moment';

const AdvancePayment = ({
  formikPurchaseDetail,
  id_purchase,
  handlePayTotal,
}) => {
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState('');
  const [error, setError] = useState('');

  const validateAmount = useCallback(
    (amount) => {
      if (formikPurchaseDetail.form.values.isPriceless) {
        setError('');
        return true;
      }

      if (!amount || amount.trim() === '') {
        setError('El monto no puede estar vacío');
        return false;
      }
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Por favor, ingrese un número válido mayor que cero');
        return false;
      }
      const totalAmount =
        formikPurchaseDetail.form.values.quantity *
          formikPurchaseDetail.form.values.price || 0;
      const currentAdvancePayments =
        formikPurchaseDetail.form.values.advancePayments || [];
      const totalAdvancePayments = currentAdvancePayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      if (parsedAmount + totalAdvancePayments > totalAmount) {
        setError(
          'El total de anticipos no puede ser mayor que el monto total de la compra'
        );
        return false;
      }
      setError('');
      return true;
    },
    [
      formikPurchaseDetail.form.values.quantity,
      formikPurchaseDetail.form.values.price,
      formikPurchaseDetail.form.values.advancePayments,
      formikPurchaseDetail.form.values.isPriceless,
    ]
  );

  useEffect(() => {
    if (advancePaymentAmount) {
      validateAmount(advancePaymentAmount);
    }
  }, [
    formikPurchaseDetail.form.values.quantity,
    formikPurchaseDetail.form.values.price,
    formikPurchaseDetail.form.values.isPriceless,
    validateAmount,
    advancePaymentAmount,
  ]);

  const handleAddAdvancePayment = useCallback(() => {
    if (validateAmount(advancePaymentAmount)) {
      const newPayments = [
        ...(formikPurchaseDetail.form.values.advancePayments || []),
        {
          amount: parseFloat(advancePaymentAmount),
          createdAt: new Date().toISOString(),
        },
      ];
      formikPurchaseDetail.form.setFieldValue('advancePayments', newPayments);
      setAdvancePaymentAmount('');
      setShowAdvancePayment(false);
    }
  }, [advancePaymentAmount, formikPurchaseDetail.form, validateAmount]);

  const handleCancelAdvancePayment = useCallback(() => {
    setAdvancePaymentAmount('');
    setShowAdvancePayment(false);
    setError('');
  }, []);

  const handleRemovePayment = useCallback(
    (index) => {
      const newPayments =
        formikPurchaseDetail.form.values.advancePayments.filter(
          (_, i) => i !== index
        );
      formikPurchaseDetail.form.setFieldValue('advancePayments', newPayments);
    },
    [formikPurchaseDetail.form]
  );

  return (
    <Box mt={2} mb={2}>
      {formikPurchaseDetail.form.values.advancePayments?.length > 0 && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="subtitle1">Anticipos</Typography>
          {id_purchase && (
            <Button variant="text" color="primary" onClick={handlePayTotal}>
              Pagar total
            </Button>
          )}
        </Box>
      )}
      {formikPurchaseDetail.form.values.advancePayments?.map(
        (payment, index) => (
          <Box key={index} display="flex" alignItems="center">
            <Typography variant="body1" sx={{ marginRight: 1 }}>
              Q{formatNumber(payment.amount)}
            </Typography>
            {payment.createdAt && (
              <Typography variant="body1" sx={{ marginRight: 1 }}>
                | {moment(payment.createdAt).format('DD/MM/YYYY HH:mm:ss')}
              </Typography>
            )}
            <IconButton size="small" onClick={() => handleRemovePayment(index)}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        )
      )}
      {!showAdvancePayment && (
        <ApsButton
          onClick={() => setShowAdvancePayment(true)}
          variant="text"
          color="primary"
          sx={{ mt: 1 }}
          startIcon={<AddIcon />}
        >
          Agregar Anticipo
        </ApsButton>
      )}
      {showAdvancePayment && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={2}
          mt={4}
          gap={2}
        >
          <Typography variant="body1">Ingrese el monto del anticipo</Typography>

          <ApsForm
            formik={{
              form: {
                values: { advancePaymentAmount },
                handleChange: (e) => {
                  setAdvancePaymentAmount(e.target.value);
                  validateAmount(e.target.value);
                },
                errors: { advancePaymentAmount: error },
                touched: { advancePaymentAmount: true },
              },
              fields: [
                {
                  name: 'advancePaymentAmount',
                  label: 'Monto',
                  type: 'number',
                  gridItem: true,
                  gridProps: { md: 12 },
                },
              ],
            }}
          />
          <Box display="flex" gap={2} width="100%">
            <ApsButton
              onClick={handleAddAdvancePayment}
              variant="contained"
              color="primary"
              sx={{ width: '50%' }}
              disabled={!!error}
            >
              Agregar
            </ApsButton>
            <ApsButton
              onClick={handleCancelAdvancePayment}
              variant="outlined"
              color="secondary"
              sx={{ width: '50%' }}
            >
              Cancelar
            </ApsButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(AdvancePayment);
