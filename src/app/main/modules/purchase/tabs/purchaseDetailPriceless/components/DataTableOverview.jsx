import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from '../../../components/DataItem';
import { formatNumber } from '@utils';

const initialStatistics = {
  totalPurchases: 0,
  totalQuantity: '0.00',
  totalAdvancePayments: '0.00',
  totalRematado: '0.00',
  totalPriceless: '0.00',
};

const DataTableOverview = ({ purchaseList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState(initialStatistics);
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (!purchaseList || purchaseList.length === 0) {
      setStatistics(initialStatistics);
      return;
    }

    const calculatedStats = purchaseList.reduce(
      (acc, purchase) => {
        const quantity = Number(purchase.quantity);
        acc.totalQuantity += quantity;
        acc.totalAdvancePayments +=
          purchase.advancePayments?.reduce(
            (sum, payment) => sum + payment.amount,
            0
          ) || 0;
        acc.totalRematado += purchase.isRemate ? quantity : 0;
        acc.totalPriceless += purchase.isPriceless ? quantity : 0;
        return acc;
      },
      {
        totalPurchases: purchaseList.length,
        totalQuantity: 0,
        totalAdvancePayments: 0,
        totalRematado: 0,
        totalPriceless: 0,
      }
    );

    setStatistics({
      ...calculatedStats,
      totalQuantity: formatNumber(calculatedStats.totalQuantity),
      totalAdvancePayments: formatNumber(calculatedStats.totalAdvancePayments),
      totalRematado: formatNumber(calculatedStats.totalRematado),
      totalPriceless: formatNumber(calculatedStats.totalPriceless),
    });
  }, [purchaseList]);

  const toggleUnit = () => setIsQuintales(!isQuintales);

  const convertToQuintales = (value) =>
    formatNumber(parseFloat(value.replace(/,/g, '')) / 100);

  const getDisplayValue = (value) =>
    isQuintales ? convertToQuintales(value) : value;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DataItem
          value={getDisplayValue(statistics.totalRematado)}
          label={`Total Rematado ${isQuintales ? '(quintales)' : '(libras)'}`}
          backgroundColor={theme.palette.warning.main}
          color={theme.palette.primary.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={getDisplayValue(statistics.totalPriceless)}
          label={`Total Sin Precio ${isQuintales ? '(quintales)' : '(libras)'}`}
          backgroundColor={theme.palette.info.main}
          color={theme.palette.primary.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={statistics.totalAdvancePayments}
          label="Total Anticipos"
          backgroundColor={theme.palette.totalAdvancePayments.background}
          color={theme.palette.totalAdvancePayments.text}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
