import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { createRemateBeneficioAction } from '../../../.././../../store/modules/saleDetail';

const PriceList = ({ selectedTruckloads, totalNeeded, id_sale, onClose }) => {
  const dispatch = useDispatch();
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [isQuantityValid, setIsQuantityValid] = useState(false);
  const [manualPrice, setManualPrice] = useState('');
  const [isPriceValid, setIsPriceValid] = useState(false);
  const purchaseDetails = useSelector(
    (state) => state.averagePrice.unaveragesPurchaseDetails
  );

  const handleToggle = (price) => {
    setSelectedPrices((prevSelectedPrices) => {
      const currentIndex = prevSelectedPrices.indexOf(price);
      if (currentIndex === -1) {
        return [...prevSelectedPrices, price];
      } else {
        return prevSelectedPrices.filter((_, index) => index !== currentIndex);
      }
    });
  };

  const calculateAverage = useMemo(() => {
    if (selectedPrices.length === 0) return 0;
    const sum = selectedPrices.reduce((acc, curr) => acc + parseFloat(curr), 0);
    return (sum / selectedPrices.length).toFixed(2);
  }, [selectedPrices]);

  const selectedTotalLbs = useMemo(() => {
    if (!purchaseDetails || purchaseDetails.length === 0) return 0;
    return purchaseDetails
      .filter((detail) => selectedPrices.includes(detail.price))
      .reduce((total, detail) => total + detail.totalQuantity, 0);
  }, [purchaseDetails, selectedPrices]);

  const excedent = useMemo(() => {
    return Math.max(0, selectedTotalLbs - totalNeeded);
  }, [selectedTotalLbs, totalNeeded]);

  useEffect(() => {
    setIsQuantityValid(selectedTotalLbs >= totalNeeded);
  }, [selectedTotalLbs, totalNeeded]);

  const lbsToQuintales = (lbs) => (lbs / 100).toFixed(2);

  const handleManualPriceChange = (event) => {
    const value = event.target.value;
    setManualPrice(value);
    setIsPriceValid(/^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) > 0);
  };

  const onButtonClick = async () => {
    if (!manualPrice || !isPriceValid) {
      console.error('Invalid manual price');
      return;
    }

    const selectedPricesData =
      purchaseDetails?.filter((detail) =>
        selectedPrices.includes(detail.price)
      ) || [];

    const data = {
      price: parseFloat(manualPrice),
      quantity: totalNeeded,
      total: totalNeeded * parseFloat(manualPrice),
      id_sale,
    };

    const accumulated =
      excedent > 0
        ? {
            quantity: excedent,
            price: parseFloat(calculateAverage),
          }
        : null;

    try {
      await dispatch(
        createRemateBeneficioAction({
          selectedPrices: selectedPricesData,
          data,
          accumulated,
          truckloadsSelected: selectedTruckloads,
        })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error('Error in createRemateBeneficioAction:', error);
    }
  };

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          mb: 2,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Resumen
          </Typography>
          <Typography variant="subtitle1">
            Precio Promedio: Q{calculateAverage}
          </Typography>
          <Typography variant="subtitle1">
            Total Lb Seleccionado: {selectedTotalLbs.toLocaleString()} lb (
            {lbsToQuintales(selectedTotalLbs)} qq)
          </Typography>
          <Typography
            variant="subtitle1"
            color={isQuantityValid ? 'success.main' : 'error.main'}
          >
            Total Necesario: {totalNeeded.toLocaleString()} lb (
            {lbsToQuintales(totalNeeded)} qq)
          </Typography>

          <Typography variant="subtitle1" color="text.disabled">
            Acumulado: {excedent.toLocaleString()} lb (
            {lbsToQuintales(excedent)} qq)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          {isQuantityValid && (
            <>
              <TextField
                label="Precio de venta"
                variant="outlined"
                size="small"
                value={manualPrice}
                onChange={handleManualPriceChange}
                error={!isPriceValid && manualPrice !== ''}
                helperText={
                  !isPriceValid && manualPrice !== '' ? 'Precio inválido' : ''
                }
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={onButtonClick}
                disabled={!isQuantityValid || !isPriceValid}
                sx={{ alignSelf: 'flex-end' }}
                startIcon={<CheckCircle />}
              >
                Remate
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <List component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
        {purchaseDetails?.slice(0, 6).map((detail, index) => (
          <ListItem
            key={index}
            dense
            button
            onClick={() => handleToggle(detail.price)}
          >
            <Checkbox
              edge="start"
              checked={selectedPrices.includes(detail.price)}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={`Q${parseFloat(detail.price).toFixed(2)}`}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {detail.totalQuantity.toLocaleString()} lb (
                  {lbsToQuintales(detail.totalQuantity)} qq)
                </Typography>
              }
            />
          </ListItem>
        ))}
        {purchaseDetails?.slice(6).map((detail, index) => (
          <ListItem
            key={index + 6}
            dense
            button
            onClick={() => handleToggle(detail.price)}
          >
            <Checkbox
              edge="start"
              checked={selectedPrices.includes(detail.price)}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={`Q${parseFloat(detail.price).toFixed(2)}`}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {detail.totalQuantity.toLocaleString()} lb (
                  {lbsToQuintales(detail.totalQuantity)} qq)
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PriceList;
