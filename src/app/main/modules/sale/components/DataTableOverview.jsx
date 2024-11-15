import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import DataItem from './DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ saleList }) => {
  const theme = useTheme();
  const purchaseDetailsResult = useSelector(
    (state) => state.sale.purchaseDetailsResult
  );
  const rowPurchaseDetails = useSelector(
    (state) => state.sale.rowPurchaseDetails
  );
  const [statistics, setStatistics] = useState({
    totalQuantity: '0.00',
    totalLbPriceless: '0.00',
    totalTruckloadsSent: '0.00',
    totalTruckloadsReceived: '0.00',
    totalLbSold: '0.00',
    totalLbAvailable: '0.00',
    totalLbAvailablePriceless: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (saleList && saleList.length > 0) {
      const totalQuantity = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbQuantity || 0),
        0
      );
      const totalLbPriceless = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbPriceless || 0),
        0
      );

      const totalTruckloadsSent = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsSent || 0),
        0
      );
      const totalTruckloadsReceived = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsReceived || 0),
        0
      );

      const totalLbSold = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbsSold || 0),
        0
      );

      setStatistics({
        totalQuantity: formatNumber(totalQuantity),
        totalLbPriceless: formatNumber(totalLbPriceless),
        totalTruckloadsSent: formatNumber(totalTruckloadsSent),
        totalTruckloadsReceived: formatNumber(totalTruckloadsReceived),
        totalLbSold: formatNumber(totalLbSold),
        totalLbAvailable: formatNumber(
          purchaseDetailsResult?.totalLbAvailable || 0
        ),
        totalLbAvailablePriceless: formatNumber(
          purchaseDetailsResult?.totalLbAvailablePriceless || 0
        ),
      });
    } else {
      setStatistics({
        totalQuantity: '0.00',
        totalLbPriceless: '0.00',
        totalTruckloadsSent: '0.00',
        totalTruckloadsReceived: '0.00',
        totalLbSold: '0.00',
        totalLbAvailable: formatNumber(
          purchaseDetailsResult?.totalLbAvailable || 0
        ),
        totalLbAvailablePriceless: formatNumber(
          purchaseDetailsResult?.totalLbAvailablePriceless || 0
        ),
      });
    }
  }, [saleList, purchaseDetailsResult, rowPurchaseDetails]);

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
              ? convertToQuintales(statistics.totalLbAvailable)
              : statistics.totalLbAvailable
          }
          label={`Total ${isQuintales ? 'qq' : 'lb'} disponibles`}
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.primary.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbAvailablePriceless)
              : statistics.totalLbAvailablePriceless
          }
          label={`Total ${isQuintales ? 'qq' : 'lb'} sin precio`}
          backgroundColor={theme.palette.balance.background}
          color={theme.palette.balance.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalTruckloadsSent)
              : statistics.totalTruckloadsSent
          }
          label={`Total ${isQuintales ? 'qq' : 'lb'} ${
            isQuintales ? 'enviados' : 'enviadas'
          } a Beneficio`}
          backgroundColor={theme.palette.totalQuantity.background}
          color={theme.palette.totalQuantity.text}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalTruckloadsReceived)
              : statistics.totalTruckloadsReceived
          }
          label={`Total ${isQuintales ? 'qq' : 'lb'} ${
            isQuintales ? 'recibidos' : 'recibidas'
          } en Beneficio`}
          backgroundColor={theme.palette.info.main}
          color={theme.palette.info.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbSold)
              : statistics.totalLbSold
          }
          label={`Total ${isQuintales ? 'qq' : 'lb'} ${
            isQuintales ? 'vendidos' : 'vendidas'
          }`}
          backgroundColor={theme.palette.success.main}
          color={theme.palette.success.contrastText}
          onClick={toggleUnit}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
