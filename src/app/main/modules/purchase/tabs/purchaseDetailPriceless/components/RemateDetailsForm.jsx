import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { formatNumber } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { createRemateAction } from '../../../../../../store/modules/purchaseDetail';
import { paymentMethodCatalogAction } from '../../../../../../store/modules/catalogs';
import ApsButton from '@components/ApsButton';
import { useAuth } from '@hooks';

const RemateDetailsForm = ({ selectedItems, handleComplete }) => {
  const dispatch = useDispatch();
  const purchaseSelected = useSelector(
    (state) => state.purchase.purchaseSelected
  );
  const cat_payment_method = useSelector(
    (state) => state.catalogs.cat_payment_method
  );
  const [rematePrice, setRematePrice] = useState('');
  const [totalRemateValue, setTotalRemateValue] = useState(0);
  const [totalAdvancePayments, setTotalAdvancePayments] = useState(0);
  const [balance, setBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState({});
  const auth = useAuth();

  const totalLibras = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  }, [selectedItems]);

  const handleRematePriceChange = (event) => {
    setRematePrice(event.target.value);
    setErrors((prev) => ({ ...prev, rematePrice: '' }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setErrors((prev) => ({ ...prev, paymentMethod: '' }));
  };

  useEffect(() => {
    dispatch(paymentMethodCatalogAction());
  }, [dispatch]);

  useEffect(() => {
    const calculatedValue = totalLibras * parseFloat(rematePrice || 0);
    setTotalRemateValue(calculatedValue);

    const advancePayments = selectedItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(
          item.advancePayments?.reduce(
            (total, payment) => total + (parseFloat(payment.amount) || 0),
            0
          )
        ) || 0),
      0
    );
    setTotalAdvancePayments(advancePayments);

    // Calculate the balance
    const calculatedBalance = calculatedValue - advancePayments;
    setBalance(calculatedBalance);
  }, [totalLibras, rematePrice, selectedItems]);

  const DataRow = ({ label, value }) => (
    <>
      <Grid item xs={6}>
        <Typography variant="body1">{label}:</Typography>
      </Grid>
      <Grid item xs={6}>
        {label === 'Precio' ? (
          <PriceInput
            value={value}
            onChange={handleRematePriceChange}
            error={!!errors.rematePrice}
            helperText={errors.rematePrice}
          />
        ) : label === 'Método de pago' ? (
          <PaymentMethodSelect
            value={value}
            onChange={handlePaymentMethodChange}
            error={!!errors.paymentMethod}
            helperText={errors.paymentMethod}
          />
        ) : (
          <Typography variant="body1" fontWeight="bold">
            {typeof value === 'number' ? `Q ${formatNumber(value)}` : value}
          </Typography>
        )}
      </Grid>
    </>
  );

  const PriceInput = React.memo(
    ({ value, onChange, error, helperText }) => (
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        type="number"
        InputProps={{
          inputProps: { min: 0, step: 0.01 },
        }}
        autoFocus
        error={error}
        helperText={helperText}
      />
    ),
    []
  );

  const PaymentMethodSelect = React.memo(
    ({ value, onChange, error, helperText }) => (
      <FormControl fullWidth error={error}>
        <InputLabel id="payment-method-label">Forma de pago</InputLabel>
        <Select
          labelId="payment-method-label"
          value={value}
          onChange={onChange}
          label="Forma de pago"
        >
          {cat_payment_method.map((method) => (
            <MenuItem key={method.id_cat_payment_method} value={method.value}>
              {method.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    ),
    [cat_payment_method]
  );

  const memoizedDataRows = useMemo(
    () => [
      { label: 'Total de libras', value: formatNumber(totalLibras) },
      { label: 'Precio', value: rematePrice },
      { label: 'Total', value: totalRemateValue },
      { label: 'Total de anticipos', value: totalAdvancePayments },
      { label: 'Saldo', value: balance },
      { label: 'Método de pago', value: paymentMethod },
    ],
    [
      totalLibras,
      rematePrice,
      totalRemateValue,
      totalAdvancePayments,
      balance,
      paymentMethod,
    ]
  );

  const handleCancel = () => {
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!rematePrice) {
      newErrors.rematePrice = 'El precio es requerido';
      isValid = false;
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'La forma de pago es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      dispatch(
        createRemateAction({
          rematePrice,
          totalAdvancePayments,
          total: balance,
          list: selectedItems,
          id_purchase: purchaseSelected.id_purchase,
          createdBy: auth.user.id_user,
          quantity: totalLibras,
          id_cat_payment_method: paymentMethod,
        })
      )
        .unwrap()
        .then(() => {
          handleComplete && handleComplete();
        })
        .catch((error) => {
          console.error(error);
        });
      dispatch(setApsGlobalModalPropsAction({ open: false }));
    }
  };

  const isFormValid = rematePrice && paymentMethod;

  return (
    <Paper elevation={0} style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {memoizedDataRows.map((row, index) => (
          <DataRow key={index} label={row.label} value={row.value} />
        ))}
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <ApsButton variant="outlined" onClick={handleCancel}>
                Cancelar
              </ApsButton>
            </Grid>
            <Grid item>
              <ApsButton
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                disabled={!isFormValid}
              >
                Confirmar Remate
              </ApsButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RemateDetailsForm;
