import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from './DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalPurchases: 0,
    totalQuantity: '0.00',
    totalQuantityPriceless: '0.00',
    averagePrice: '0.00',
    totalAmount: '0.00',
    totalAdvancePayments: '0.00',
    totalDebt: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      const totalPurchases = purchaseList.length;
      const totalQuantity = purchaseList.reduce(
        (sum, purchase) =>
          sum + (purchase.isPriceless ? 0 : Number(purchase.quantity)),
        0
      );
      const totalQuantityPriceless = purchaseList.reduce(
        (sum, purchase) =>
          sum +
          (purchase.isPriceless && !purchase.isRemate
            ? Number(purchase.quantity)
            : 0),
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
          (true
            ? purchase.advancePayments?.reduce(
                (paymentSum, payment) => paymentSum + payment.amount,
                0
              ) || 0
            : 0),
        0
      );
      const totalDebt = Math.max(
        0,
        purchaseList.reduce((sum, purchase) => {
          if (
            !purchase.isPriceless &&
            !purchase.isRemate &&
            purchase.advancePayments &&
            purchase.advancePayments.length > 0
          ) {
            const purchaseTotal = purchase.quantity * purchase.price;
            const purchaseAdvances = purchase.advancePayments.reduce(
              (total, payment) => total + payment.amount,
              0
            );
            return sum + (purchaseTotal - purchaseAdvances);
          }
          return sum;
        }, 0)
      );

      setStatistics({
        totalPurchases: totalPurchases,
        totalQuantity: formatNumber(totalQuantity),
        totalQuantityPriceless: formatNumber(totalQuantityPriceless),
        averagePrice: formatNumber(averagePrice),
        totalAmount: formatNumber(totalAmount),
        totalAdvancePayments: formatNumber(totalAdvancePayments),
        totalDebt: formatNumber(totalDebt),
      });
    } else {
      setStatistics({
        totalPurchases: 0,
        totalQuantity: '0.00',
        totalQuantityPriceless: '0.00',
        averagePrice: '0.00',
        totalAmount: '0.00',
        totalAdvancePayments: '0.00',
        totalDebt: '0.00',
      });
    }
  }, [purchaseList]);

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
          label={`Total ${
            isQuintales ? 'Quintales Pagados' : 'Libras Pagadas'
          } `}
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalQuantityPriceless)
              : statistics.totalQuantityPriceless
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} Sin Precio`}
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={`Q${statistics.averagePrice}`}
          label="Precio Promedio"
          backgroundColor={theme.palette.averagePrice.background}
          color={theme.palette.averagePrice.text}
        />
        {/* <DataItem
          value={`Q${statistics.totalAmount}`}
          label="Monto Total"
          backgroundColor={theme.palette.totalAmount.background}
          color={theme.palette.totalAmount.text}
        /> */}
        <DataItem
          value={`Q${statistics.totalAdvancePayments}`}
          label="Total Anticipos"
          backgroundColor={theme.palette.totalAdvancePayments.background}
          color={theme.palette.totalAdvancePayments.text}
        />
        <DataItem
          value={`Q${statistics.totalDebt}`}
          label="Total Deuda"
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
