import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DataItem from './DataItem';

const DataOverview = ({ purchaseList }) => {
  const [statistics, setStatistics] = useState({
    totalPurchases: 0,
    totalQuantity: 0,
    averagePrice: 0,
    totalAmount: 0,
  });

  // Define color variables
  const colors = {
    totalPurchases: {
      background: '#e3f2fd',
      text: '#1565c0',
    },
    totalQuantity: {
      background: '#e8f5e9',
      text: '#2e7d32',
    },
    averagePrice: {
      background: '#fff3e0',
      text: '#e65100',
    },
    totalAmount: {
      background: '#fce4ec',
      text: '#c2185b',
    },
  };

  const formatNumber = (number) => {
    if (typeof number === 'string') {
      number = parseFloat(number);
    }
    if (typeof number !== 'number' || isNaN(number)) {
      return '0.00';
    }
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (purchaseList.length > 0) {
      const totalPurchases = purchaseList.length;
      const totalQuantity = purchaseList.reduce(
        (sum, purchase) => sum + Number(purchase.quantity),
        0
      );
      const totalAmount = purchaseList.reduce(
        (sum, purchase) => sum + purchase.quantity * purchase.price,
        0
      );
      const averagePrice = totalAmount / totalQuantity;

      setStatistics({
        totalPurchases: totalPurchases,
        totalQuantity: formatNumber(totalQuantity),
        averagePrice: formatNumber(averagePrice),
        totalAmount: formatNumber(totalAmount),
      });
    }
  }, [purchaseList]);

  return (
    <Box sx={{ mb: 3 }}>
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Resumen de Compras
      </Typography> */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DataItem
          value={statistics.totalPurchases}
          label="Total Compras"
          backgroundColor={colors.totalPurchases.background}
          color={colors.totalPurchases.text}
        />
        <DataItem
          value={statistics.totalQuantity}
          label="Total Libras"
          backgroundColor={colors.totalQuantity.background}
          color={colors.totalQuantity.text}
        />
        <DataItem
          value={`Q${statistics.averagePrice}`}
          label="Precio Promedio"
          backgroundColor={colors.averagePrice.background}
          color={colors.averagePrice.text}
        />
        <DataItem
          value={`Q${statistics.totalAmount}`}
          label="Monto Total"
          backgroundColor={colors.totalAmount.background}
          color={colors.totalAmount.text}
        />
      </Box>
    </Box>
  );
};

export default DataOverview;
