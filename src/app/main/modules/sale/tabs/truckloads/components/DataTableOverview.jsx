import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from '../../../components/DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ truckloadList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalTruckloads: 0,
    totalSent: '0.00',
    totalReceived: '0.00',
    difference: '0.00',
    availableForSale: '0.00',
    totalSold: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (truckloadList && truckloadList.length > 0) {
      console.log(truckloadList);
      const totalTruckloads = truckloadList.length;
      const totalSent = truckloadList.reduce(
        (sum, truckload) => sum + Number(truckload.totalSent),
        0
      );
      const totalReceived = truckloadList.reduce(
        (sum, truckload) =>
          sum + (!truckload.isSold ? Number(truckload.totalReceived) : 0),
        0
      );
      const totalSold = truckloadList.reduce(
        (sum, truckload) =>
          sum + (truckload.isSold ? Number(truckload.totalReceived) : 0),
        0
      );
      const difference = totalReceived - totalSent;
      const availableForSale = totalReceived - totalSold;

      setStatistics({
        totalTruckloads: totalTruckloads,
        totalSent: formatNumber(totalSent),
        totalReceived: formatNumber(totalReceived),
        difference: formatNumber(difference),
        availableForSale: formatNumber(availableForSale),
        totalSold: formatNumber(totalSold),
      });
    } else {
      setStatistics({
        totalTruckloads: 0,
        totalSent: '0.00',
        totalReceived: '0.00',
        difference: '0.00',
        availableForSale: '0.00',
        totalSold: '0.00',
      });
    }
  }, [truckloadList]);

  const toggleUnit = () => {
    setIsQuintales(!isQuintales);
  };

  const convertToQuintales = (value) => {
    return formatNumber(parseFloat(value.replace(/,/g, '')) / 100);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* <DataItem
          value={statistics.totalTruckloads}
          label="Total Camionadas"
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
        /> */}
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalSent)
              : statistics.totalSent
          }
          label={`Total Enviado (${isQuintales ? 'qq' : 'lb'})`}
          backgroundColor={theme.palette.totalAmount.background}
          color={theme.palette.totalAmount.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalReceived)
              : statistics.totalReceived
          }
          label={`Total Recibido (${isQuintales ? 'qq' : 'lb'})`}
          backgroundColor={theme.palette.averagePrice.background}
          color={theme.palette.averagePrice.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.difference)
              : statistics.difference
          }
          label={`Diferencia (${isQuintales ? 'qq' : 'lb'})`}
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.availableForSale)
              : statistics.availableForSale
          }
          label={`Disponible para venta (${isQuintales ? 'qq' : 'lb'})`}
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.primary.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalSold)
              : statistics.totalSold
          }
          label={`Total Vendido (${isQuintales ? 'qq' : 'lb'})`}
          backgroundColor={theme.palette.success.main}
          color={theme.palette.success.contrastText}
          onClick={toggleUnit}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
