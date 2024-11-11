import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from './DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ saleList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalQuantity: '0.00',
    totalLbPriceless: '0.00',
    totalTruckloadsSent: '0.00',
    totalTruckloadsReceived: '0.00',
    totalLbSold: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (saleList && saleList.length > 0) {
      const totalQuantity = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbQuantity || 0),
        0
      );
      const totalLbPriceless = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbPriceless || 0),
        0
      );

      const totalTruckloadsSent = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsSent || 0),
        0
      );
      const totalTruckloadsReceived = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsReceived || 0),
        0
      );

      const totalLbSold = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbsSold || 0),
        0
      );

      setStatistics({
        totalQuantity: formatNumber(totalQuantity),
        totalLbPriceless: formatNumber(totalLbPriceless),
        totalTruckloadsSent: formatNumber(totalTruckloadsSent),
        totalTruckloadsReceived: formatNumber(totalTruckloadsReceived),
        totalLbSold: formatNumber(totalLbSold),
      });
    } else {
      setStatistics({
        totalQuantity: '0.00',
        totalLbPriceless: '0.00',
        totalTruckloadsSent: '0.00',
        totalTruckloadsReceived: '0.00',
        totalLbSold: '0.00',
      });
    }
  }, [saleList]);

  const toggleUnit = () => {
    setIsQuintales(!isQuintales);
  };

  const convertToQuintales = (value) => {
    return formatNumber(parseFloat(value.replace(/,/g, '')) / 100);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalQuantity)
              : statistics.totalQuantity
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} Disponibles`}
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.primary.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbPriceless)
              : statistics.totalLbPriceless
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} Sin Precio`}
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalTruckloadsSent)
              : statistics.totalTruckloadsSent
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} ${
            isQuintales ? 'Enviados' : 'Enviadas'
          }`}
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalTruckloadsReceived)
              : statistics.totalTruckloadsReceived
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} ${
            isQuintales ? 'Recibidos' : 'Recibidas'
          }`}
          backgroundColor={theme.palette.info.main}
          color={theme.palette.info.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbSold)
              : statistics.totalLbSold
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} ${
            isQuintales ? 'Vendidos' : 'Vendidas'
          }`}
          backgroundColor={theme.palette.success.main}
          color={theme.palette.success.contrastText}
          onClick={toggleUnit}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
