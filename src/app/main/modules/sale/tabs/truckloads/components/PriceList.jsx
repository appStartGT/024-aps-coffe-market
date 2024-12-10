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
  const [sellQuantity, setSellQuantity] = useState(totalNeeded);
  const [error, setError] = useState('');
  const [operativeCost, setOperativeCost] = useState(0.03);
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
    const sum = selectedPrices.reduce((acc, curr) => acc + parseFloat(curr) + parseFloat(operativeCost || 0), 0);
    return (sum / selectedPrices.length).toFixed(2);
  }, [selectedPrices, operativeCost]);

  const selectedTotalLbs = useMemo(() => {
    if (!purchaseDetails || purchaseDetails.length === 0) return 0;
    return purchaseDetails
      .filter((detail) => selectedPrices.includes(detail.price))
      .reduce((total, detail) => total + detail.totalQuantity, 0);
  }, [purchaseDetails, selectedPrices]);

  const excedent = useMemo(() => {
    return Math.max(0, selectedTotalLbs - sellQuantity);
  }, [selectedTotalLbs, sellQuantity]);

  const totalSale = useMemo(() => {
    if (!manualPrice || !sellQuantity) return 0;
    return parseFloat(manualPrice) * sellQuantity;
  }, [manualPrice, sellQuantity]);

  useEffect(() => {
    setIsQuantityValid(selectedTotalLbs >= sellQuantity);
  }, [selectedTotalLbs, sellQuantity]);

  const lbsToQuintales = (lbs) => (lbs / 100).toFixed(2);

  const handleManualPriceChange = (event) => {
    const value = event.target.value;
    setManualPrice(value);
    if (!value) {
      setError('El precio es requerido');
      setIsPriceValid(false);
    } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      setError('Formato inválido. Use números con hasta 2 decimales');
      setIsPriceValid(false);
    } else if (parseFloat(value) <= 0) {
      setError('El precio debe ser mayor a 0');
      setIsPriceValid(false);
    } else {
      setError('');
      setIsPriceValid(true);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0 && value <= totalNeeded) {
      setSellQuantity(value);
    }
  };

  const handleOperativeCostChange = (event) => {
    const value = event.target.value;
    if (!value || /^\d+(\.\d{0,2})?$/.test(value)) {
      setOperativeCost(value);
    }
  };

  const onButtonClick = async () => {
    if (!manualPrice || !isPriceValid) {
      setError('Precio inválido');
      return;
    }

    const selectedPricesData =
      purchaseDetails?.filter((detail) =>
        selectedPrices.includes(detail.price)
      ) || [];

    const data = {
      price: parseFloat(manualPrice),
      quantity: sellQuantity,
      total: sellQuantity * parseFloat(manualPrice),
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
      // await dispatch(
      //   createRemateBeneficioAction({
      //     selectedPrices: selectedPricesData,
      //     data,
      //     accumulated,
      //     truckloadsSelected: selectedTruckloads,
      //   })
      // ).unwrap();
      // onClose();
      console.log({
        selectedPrices: selectedPricesData,
        data,
        accumulated,
        truckloadsSelected: selectedTruckloads,
      });
    } catch (error) {
      setError('Error al crear el remate');
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
            Total Camionadas: {totalNeeded.toLocaleString()} lb (
            {lbsToQuintales(totalNeeded)} qq)
          </Typography>

          <Typography variant="subtitle1" color="text.disabled">
            Acumulado: {excedent.toLocaleString()} lb (
            {lbsToQuintales(excedent)} qq)
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              label="Cantidad a vender (lb)"
              variant="outlined"
              size="small"
              type="number"
              value={sellQuantity}
              onChange={handleQuantityChange}
              inputProps={{ /* min: 0, */ max: totalNeeded }}
              sx={{ width: '200px', mr: 1 }}
              error={sellQuantity <= 0 || sellQuantity > totalNeeded}
              helperText={
                sellQuantity <= 0 || sellQuantity > totalNeeded
                  ? 'Cantidad inválida'
                  : ''
              }
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSellQuantity(totalNeeded)}
              disabled={selectedTotalLbs < totalNeeded}
            >
              Todo
            </Button>
          </Box>
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
                error={!!error}
                helperText={error}
                sx={{ mr: 2 }}
              />
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Total: Q
                {totalSale.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onButtonClick}
            disabled={!isQuantityValid || !isPriceValid}
            sx={{ alignSelf: 'flex-end', mt: 2 }}
            startIcon={<CheckCircle />}
          >
            Remate
          </Button>
        </Box>
      </Paper>
      {/* List of prices */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Costo Operativo"
          variant="outlined"
          size="small"
          value={operativeCost}
          onChange={handleOperativeCostChange}
          type="text"
          sx={{ width: '200px' }}
        />
      </Box>
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
              primary={`Q${(parseFloat(detail.price) + parseFloat(operativeCost || 0)).toFixed(2)}`}
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
              primary={`Q${(parseFloat(detail.price) + parseFloat(operativeCost || 0)).toFixed(2)}`}
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

