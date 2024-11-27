import React, { useEffect, useState } from 'react';
import { Box, useTheme, IconButton } from '@mui/material';
import DataItem from './DataItem';
import { formatNumber } from '@utils';
import { useSelector } from 'react-redux';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const expensesGrandTotal = useSelector(
    (state) => state.budget.expenses?.totals?.grandTotal
  );

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
  const [showAveragePriceWithExpenses, setShowAveragePriceWithExpenses] =
    useState(false);

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      const totalQuantity = Number(
        purchaseList
          .reduce((sum, purchase) => sum + Number(purchase.totalLbQuantity), 0)
          .toFixed(2)
      );

      const totalLbPriced = Number(
        purchaseList
          .reduce((sum, purchase) => sum + Number(purchase.totalLbPriced), 0)
          .toFixed(2)
      );

      const totalLbPriceless = Number(
        purchaseList
          .reduce((sum, purchase) => sum + Number(purchase.totalLbPriceless), 0)
          .toFixed(2)
      );

      const totalLbRemate = Number(
        purchaseList
          .reduce((sum, purchase) => sum + Number(purchase.totalLbRemate), 0)
          .toFixed(2)
      );

      const totalAmount = Number(
        purchaseList
          .reduce(
            (sum, purchase) => sum + Number(purchase.totalPricedAmount),
            0
          )
          .toFixed(2)
      );

      const averagePrice = Number(
        totalQuantity !== 0
          ? (totalAmount / (totalLbPriced + totalLbRemate)).toFixed(2)
          : 0
      );

      const averagePriceWithExpenses = Number(
        totalQuantity !== 0
          ? (
              (expensesGrandTotal || 0) /
              (totalLbPriced + totalLbRemate)
            ).toFixed(2)
          : 0
      );

      const totalAdvancePayments = Number(
        purchaseList
          .reduce(
            (sum, purchase) =>
              sum +
              (purchase.advancePayments?.reduce(
                (paymentSum, payment) => paymentSum + Number(payment.amount),
                0
              ) || 0),
            0
          )
          .toFixed(2)
      );

      const totalDebt = Number(
        Math.max(
          0,
          purchaseList.reduce((sum, purchase) => {
            if (
              !purchase.isPriceless &&
              !purchase.isRemate &&
              purchase.advancePayments &&
              purchase.advancePayments.length > 0
            ) {
              const purchaseTotal =
                Number(purchase.quantity) * Number(purchase.price);
              const purchaseAdvances = purchase.advancePayments.reduce(
                (total, payment) => total + Number(payment.amount),
                0
              );
              return sum + (purchaseTotal - purchaseAdvances);
            }
            return sum;
          }, 0)
        ).toFixed(2)
      );

      setStatistics({
        totalQuantity: formatNumber(totalQuantity),
        totalLbPriceless: formatNumber(totalLbPriceless),
        averagePrice: formatNumber(averagePrice),
        averagePriceWithExpenses: formatNumber(averagePriceWithExpenses),
        totalAmount: formatNumber(totalAmount),
        totalAdvancePayments: formatNumber(totalAdvancePayments),
        totalDebt: formatNumber(totalDebt),
        totalLbPriced: formatNumber(totalLbPriced),
        totalLbRemate: formatNumber(totalLbRemate),
      });
    } else {
      setStatistics({
        totalQuantity: '0.00',
        totalLbPriceless: '0.00',
        averagePrice: '0.00',
        averagePriceWithExpenses: '0.00',
        totalAmount: '0.00',
        totalAdvancePayments: '0.00',
        totalDebt: '0.00',
        totalLbPriced: '0.00',
        totalLbRemate: '0.00',
      });
    }
  }, [purchaseList, expensesGrandTotal]);

  const toggleUnit = () => {
    setIsQuintales(!isQuintales);
  };

  const toggleAveragePrice = () => {
    setShowAveragePriceWithExpenses(!showAveragePriceWithExpenses);
  };

  const convertToQuintales = (value) => {
    return formatNumber((parseFloat(value.replace(/,/g, '')) / 100).toFixed(2));
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
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.primary.contrastText}
          icon={
            <IconButton
              onClick={toggleUnit}
              size="small"
              sx={{ color: theme.palette.primary.contrastText }}
            >
              <SwapHorizIcon />
            </IconButton>
          }
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
          icon={
            <IconButton
              onClick={toggleUnit}
              size="small"
              sx={{ color: theme.palette.totalQuantity.text }}
            >
              <SwapHorizIcon />
            </IconButton>
          }
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
          icon={
            <IconButton
              onClick={toggleUnit}
              size="small"
              sx={{ color: theme.palette.balance.text }}
            >
              <SwapHorizIcon />
            </IconButton>
          }
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
          icon={
            <IconButton
              onClick={toggleUnit}
              size="small"
              sx={{ color: theme.palette.warning.contrastText }}
            >
              <SwapHorizIcon />
            </IconButton>
          }
        />
        <DataItem
          value={`Q${
            showAveragePriceWithExpenses
              ? statistics.averagePriceWithExpenses
              : statistics.averagePrice
          }`}
          label={`Precio Promedio ${
            showAveragePriceWithExpenses ? '(con gastos)' : ''
          }`}
          backgroundColor={theme.palette.info.main}
          color={theme.palette.info.contrastText}
          icon={
            <IconButton
              onClick={toggleAveragePrice}
              size="small"
              sx={{ color: theme.palette.info.contrastText }}
            >
              <SwapHorizIcon />
            </IconButton>
          }
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
