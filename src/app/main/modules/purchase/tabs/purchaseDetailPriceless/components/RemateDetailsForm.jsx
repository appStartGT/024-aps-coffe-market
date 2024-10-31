import React, { useState, useEffect, useMemo } from 'react';
import { Grid, TextField, Typography, Paper } from '@mui/material';
import { formatNumber } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../../../../../../store/modules/main';
import { createRemateAction } from '../../../../../../store/modules/purchaseDetail';
import ApsButton from '@components/ApsButton';
import { useAuth } from '@hooks';

const RemateDetailsForm = ({ selectedItems }) => {
  const dispatch = useDispatch();
  const purchaseSelected = useSelector(
    (state) => state.purchase.purchaseSelected
  );
  const [rematePrice, setRematePrice] = useState('');
  const [totalRemateValue, setTotalRemateValue] = useState(0);
  const [totalAdvancePayments, setTotalAdvancePayments] = useState(0);
  const [balance, setBalance] = useState(0);
  const auth = useAuth();

  const totalLibras = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  }, [selectedItems]);

  const handleRematePriceChange = (event) => {
    setRematePrice(event.target.value);
  };

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
          <PriceInput value={value} onChange={handleRematePriceChange} />
        ) : (
          <Typography variant="body1" fontWeight="bold">
            {typeof value === 'number' ? `Q ${formatNumber(value)}` : value}
          </Typography>
        )}
      </Grid>
    </>
  );

  const PriceInput = React.memo(
    ({ value, onChange }) => (
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        type="number"
        InputProps={{
          inputProps: { min: 0, step: 0.01 },
        }}
        autoFocus
      />
    ),
    []
  );

  const memoizedDataRows = useMemo(
    () => [
      { label: 'Total de libras', value: formatNumber(totalLibras) },
      { label: 'Precio', value: rematePrice },
      { label: 'Total', value: totalRemateValue },
      { label: 'Total de anticipos', value: totalAdvancePayments },
      { label: 'Saldo', value: balance },
    ],
    [totalLibras, rematePrice, totalRemateValue, totalAdvancePayments, balance]
  );

  const handleCancel = () => {
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };
  console.log(auth.user);

  const handleConfirm = () => {
    dispatch(
      createRemateAction({
        rematePrice,
        totalAdvancePayments,
        total: balance,
        list: selectedItems,
        id_purchase: purchaseSelected.id_purchase,
        createdBy: auth.user.id_user,
        quantity: totalLibras,
      })
    );
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

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
