import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from '../../../components/DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalQuantity: '0.00',
    averagePrice: '0.00',
    totalAmount: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      const totalQuantity = purchaseList.reduce(
        (sum, purchase) => sum + Number(purchase.quantity),
        0
      );
      const totalAmount = purchaseList.reduce(
        (sum, purchase) => sum + purchase.quantity * purchase.price,
        0
      );
      const averagePrice =
        totalQuantity !== 0 ? totalAmount / totalQuantity : 0;

      setStatistics({
        totalQuantity: formatNumber(totalQuantity),
        averagePrice: formatNumber(averagePrice),
        totalAmount: formatNumber(totalAmount),
      });
    } else {
      setStatistics({
        totalQuantity: '0.00',
        averagePrice: '0.00',
        totalAmount: '0.00',
      });
    }
  }, [purchaseList]);

  const toggleUnit = () => setIsQuintales(!isQuintales);

  const convertToQuintales = (value) =>
    formatNumber(parseFloat(value.replace(/,/g, '')) / 100);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalQuantity)
              : statistics.totalQuantity
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'}`}
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={`Q${statistics.totalAmount}`}
          label="Total Monto"
          backgroundColor={theme.palette.totalAmount.background}
          color={theme.palette.totalAmount.text}
        />
        <DataItem
          value={`Q${statistics.averagePrice}`}
          label="Precio Promedio"
          backgroundColor={theme.palette.averagePrice.background}
          color={theme.palette.averagePrice.text}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
