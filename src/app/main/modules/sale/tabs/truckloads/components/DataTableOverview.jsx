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
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (truckloadList && truckloadList.length > 0) {
      const totalTruckloads = truckloadList.length;
      const totalSent = truckloadList.reduce(
        (sum, truckload) => sum + Number(truckload.totalSent),
        0
      );
      const totalReceived = truckloadList.reduce(
        (sum, truckload) => sum + Number(truckload.totalReceived),
        0
      );
      const difference = totalReceived - totalSent;

      setStatistics({
        totalTruckloads: totalTruckloads,
        totalSent: formatNumber(totalSent),
        totalReceived: formatNumber(totalReceived),
        difference: formatNumber(difference),
      });
    } else {
      setStatistics({
        totalTruckloads: 0,
        totalSent: '0.00',
        totalReceived: '0.00',
        difference: '0.00',
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
          label={`Total Enviado (${isQuintales ? 'Quintales' : 'Libras'})`}
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
          label={`Total Recibido (${isQuintales ? 'Quintales' : 'Libras'})`}
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
          label={`Diferencia (${isQuintales ? 'Quintales' : 'Libras'})`}
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
          onClick={toggleUnit}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
