import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from '../../../components/DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalPurchases: 0,
    totalQuantity: '0.00',
    averagePrice: '0.00',
    totalAmount: '0.00',
    totalAdvancePayments: '0.00',
    doubt: '0.00',
    totalRemateQuantity: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

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
      const totalAdvancePayments = purchaseList.reduce((sum, purchase) => {
        const purchaseTotal = purchase.quantity * purchase.price;
        const advancePaymentsSum =
          purchase.advancePayments?.reduce(
            (paymentSum, payment) => paymentSum + payment.amount,
            0
          ) || 0;
        // Only include in total if advance payments sum is less than purchase total
        return (
          sum + (advancePaymentsSum < purchaseTotal ? advancePaymentsSum : 0)
        );
      }, 0);
      const doubt = purchaseList.reduce((sum, purchase) => {
        const purchaseTotal = purchase.quantity * purchase.price;
        const purchaseAdvances =
          purchase.advancePayments?.reduce(
            (total, payment) => total + payment.amount,
            0
          ) || 0;
        // Only include in doubt if advance payments sum is less than purchase total
        return (
          sum +
          (purchase.advancePayments.length > 0 && !purchase.isRemate
            ? purchaseTotal - purchaseAdvances
            : 0)
        );
      }, 0);
      const balance = totalAmount - doubt;
      const totalRemateQuantity = purchaseList.reduce(
        (sum, purchase) =>
          sum + (purchase.isRemate ? Number(purchase.quantity) : 0),
        0
      );

      setStatistics({
        totalPurchases: totalPurchases,
        totalQuantity: formatNumber(totalQuantity),
        averagePrice: formatNumber(averagePrice),
        totalAmount: formatNumber(totalAmount),
        totalAdvancePayments: formatNumber(totalAdvancePayments),
        doubt: formatNumber(doubt),
        balance: formatNumber(balance),
        totalRemateQuantity: formatNumber(totalRemateQuantity),
      });
    } else {
      setStatistics({
        totalPurchases: 0,
        totalQuantity: '0.00',
        averagePrice: '0.00',
        totalAmount: '0.00',
        totalAdvancePayments: '0.00',
        doubt: '0.00',
        balance: '0.00',
        totalRemateQuantity: '0.00',
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
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'}`}
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
          onClick={toggleUnit}
        />
        {/* <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalRemateQuantity)
              : statistics.totalRemateQuantity
          }
          label={`Total ${isQuintales ? ' Quintales' : 'Libras'} Remate`}
          backgroundColor={theme.palette.warning.main}
          color={theme.palette.warning.contrastText}
          onClick={toggleUnit}
        /> */}
        <DataItem
          value={`Q${statistics.balance}`}
          label="Total"
          backgroundColor={theme.palette.totalAmount.background}
          color={theme.palette.totalAmount.text}
        />
        <DataItem
          value={`Q${statistics.averagePrice}`}
          label="Precio Promedio"
          backgroundColor={theme.palette.averagePrice.background}
          color={theme.palette.averagePrice.text}
        />

        <DataItem
          value={`Q${statistics.totalAdvancePayments}`}
          label="Total Anticipos"
          backgroundColor={theme.palette.totalAdvancePayments.background}
          color={theme.palette.totalAdvancePayments.text}
        />
        {/* <DataItem
          value={`Q${statistics.doubt}`}
          label="Deuda"
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
        /> */}
      </Box>
    </Box>
  );
};

export default DataTableOverview;
