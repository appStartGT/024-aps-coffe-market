import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from '../../components/DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalPurchases: 0,
    totalQuantity: 0,
    averagePrice: 0,
    totalAmount: 0,
    totalAdvancePayments: 0,
    balance: 0,
  });

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
      const totalAdvancePayments = purchaseList.reduce(
        (sum, purchase) =>
          sum +
          (purchase.advancePayments?.reduce(
            (paymentSum, payment) => paymentSum + payment.amount,
            0
          ) || 0),
        0
      );
      const balance = totalAmount - totalAdvancePayments;

      setStatistics({
        totalPurchases: totalPurchases,
        totalQuantity: formatNumber(totalQuantity),
        averagePrice: formatNumber(averagePrice),
        totalAmount: formatNumber(totalAmount),
        totalAdvancePayments: formatNumber(totalAdvancePayments),
        balance: formatNumber(balance),
      });
    }
  }, [purchaseList]);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DataItem
          value={statistics.totalPurchases}
          label="Total Compras"
          backgroundColor={theme.palette.totalPurchases.background}
          color={theme.palette.totalPurchases.text}
        />
        <DataItem
          value={statistics.totalQuantity}
          label="Total Libras"
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
        />
        <DataItem
          value={`Q${statistics.averagePrice}`}
          label="Precio Promedio"
          backgroundColor={theme.palette.averagePrice.background}
          color={theme.palette.averagePrice.text}
        />
        <DataItem
          value={`Q${statistics.totalAmount}`}
          label="Monto Total"
          backgroundColor={theme.palette.totalAmount.background}
          color={theme.palette.totalAmount.text}
        />
        <DataItem
          value={`Q${statistics.totalAdvancePayments}`}
          label="Total Anticipos"
          backgroundColor={theme.palette.totalAdvancePayments.background}
          color={theme.palette.totalAdvancePayments.text}
        />
        <DataItem
          value={`Q${statistics.balance}`}
          label="Saldo"
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
