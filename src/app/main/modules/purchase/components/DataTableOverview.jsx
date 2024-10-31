import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from './DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalPurchases: 0,
    totalQuantity: '0.00',
    averagePrice: '0.00',
    totalAmount: '0.00',
    totalAdvancePayments: '0.00',
    totalDebt: '0.00',
    totalLbPriced: '0.00',
    totalLbPriceless: '0.00',
    totalLbRemate: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      const totalPurchases = purchaseList.length;
      const totalQuantity = purchaseList.reduce(
        (sum, purchase) =>
          sum + (purchase.isPriceless ? 0 : Number(purchase.totalLbQuantity)),
        0
      );
      const totalLbPriceless = purchaseList.reduce(
        (sum, purchase) => sum + purchase.totalLbPriceless,
        0
      );
      const totalLbRemate = purchaseList.reduce(
        (sum, purchase) => sum + purchase.totalLbRemate,
        0
      );
      const totalAmount = purchaseList.reduce(
        (sum, purchase) => sum + purchase.totalPricedAmount,
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
      const totalLbPriced = purchaseList.reduce(
        (sum, purchase) => sum + Number(+purchase.totalLbPriced),
        0
      );

      setStatistics({
        totalPurchases: totalPurchases,
        totalQuantity: formatNumber(totalQuantity),
        totalLbPriceless: formatNumber(totalLbPriceless),
        averagePrice: formatNumber(averagePrice),
        totalAmount: formatNumber(totalAmount),
        totalAdvancePayments: formatNumber(totalAdvancePayments),
        totalDebt: formatNumber(totalDebt),
        totalLbPriced: formatNumber(totalLbPriced),
        totalLbRemate: formatNumber(totalLbRemate),
      });
    } else {
      setStatistics({
        totalPurchases: 0,
        totalQuantity: '0.00',
        totalLbPriceless: '0.00',
        averagePrice: '0.00',
        totalAmount: '0.00',
        totalAdvancePayments: '0.00',
        totalDebt: '0.00',
        totalLbPriced: '0.00',
        totalLbRemate: '0.00',
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
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} `}
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.primary.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbPriced)
              : statistics.totalLbPriced
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} Pagadas`}
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
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
              ? convertToQuintales(statistics.totalLbRemate)
              : statistics.totalLbRemate
          }
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} Remate`}
          backgroundColor={theme.palette.warning.main}
          color={theme.palette.warning.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={`Q${statistics.totalDebt}`}
          label="Total Deuda"
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
        />
        <DataItem
          value={`Q${statistics.averagePrice}`}
          label="Precio Promedio"
          backgroundColor={theme.palette.info.main}
          color={theme.palette.info.contrastText}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
