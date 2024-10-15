import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from '../../components/DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalPurchases: 0,
    totalQuantity: '0.00',
    totalAdvancePayments: '0.00',
  });

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      const totalPurchases = purchaseList.length;
      const totalQuantity = purchaseList.reduce(
        (sum, purchase) => sum + Number(purchase.quantity),
        0
      );
      const totalAdvancePayments = purchaseList.reduce(
        (sum, purchase) =>
          sum +
          (purchase.advancePayments?.reduce(
            (paymentSum, payment) => paymentSum + payment.amount,
            0
          ) || 0),
        0
      );

      setStatistics({
        totalPurchases: totalPurchases,
        totalQuantity: formatNumber(totalQuantity),
        totalAdvancePayments: formatNumber(totalAdvancePayments),
      });
    } else {
      setStatistics({
        totalPurchases: 0,
        totalQuantity: '0.00',
        totalAdvancePayments: '0.00',
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
          value={`Q${statistics.totalAdvancePayments}`}
          label="Total Anticipos"
          backgroundColor={theme.palette.totalAdvancePayments.background}
          color={theme.palette.totalAdvancePayments.text}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
