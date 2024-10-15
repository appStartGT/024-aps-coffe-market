import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from '../../components/DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalPurchases: 0,
    totalQuantity: '0.00',
    averagePrice: '0.00',
    totalAmount: '0.00',
    totalAdvancePayments: '0.00',
    balance: '0.00',
  });

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      const totalPurchases = purchaseList.length;
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
      const totalAdvancePayments = purchaseList.reduce(
        (sum, purchase) =>
          sum +
          (purchase.advancePayments?.reduce(
            (paymentSum, payment) => paymentSum + payment.amount,
            0
          ) || 0),
        0
      );
      const balance = purchaseList.reduce((sum, purchase) => {
        if (purchase.advancePayments && purchase.advancePayments.length > 0) {
          const purchaseTotal = purchase.quantity * purchase.price;
          const purchaseAdvances = purchase.advancePayments.reduce(
            (total, payment) => total + payment.amount,
            0
          );
          return sum + (purchaseTotal - purchaseAdvances);
        }
        return sum;
      }, 0);

      setStatistics({
        totalPurchases: totalPurchases,
        totalQuantity: formatNumber(totalQuantity),
        averagePrice: formatNumber(averagePrice),
        totalAmount: formatNumber(totalAmount),
        totalAdvancePayments: formatNumber(totalAdvancePayments),
        balance: formatNumber(balance),
      });
    } else {
      setStatistics({
        totalPurchases: 0,
        totalQuantity: '0.00',
        averagePrice: '0.00',
        totalAmount: '0.00',
        totalAdvancePayments: '0.00',
        balance: '0.00',
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
