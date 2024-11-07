import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DataItem from './DataItem';
import { formatNumber } from '@utils';

const DataTableOverview = ({ saleList }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState({
    totalQuantity: '0.00',
    totalLbPriced: '0.00',
    totalLbPriceless: '0.00',
    totalTruckloadsSent: '0.00',
    totalTruckloadsReceived: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    if (saleList && saleList.length > 0) {
      const totalQuantity = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbQuantity || 0),
        0
      );
      const totalLbPriced = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbPriced || 0),
        0
      );
      const totalLbPriceless = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbPriceless || 0),
        0
      );

      console.log({ saleList });
      const totalTruckloadsSent = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsSent || 0),
        0
      );
      const totalTruckloadsReceived = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsReceived || 0),
        0
      );

      setStatistics({
        totalQuantity: formatNumber(totalQuantity),
        totalLbPriced: formatNumber(totalLbPriced),
        totalLbPriceless: formatNumber(totalLbPriceless),
        totalTruckloadsSent: formatNumber(totalTruckloadsSent),
        totalTruckloadsReceived: formatNumber(totalTruckloadsReceived),
      });
    } else {
      setStatistics({
        totalQuantity: '0.00',
        totalLbPriced: '0.00',
        totalLbPriceless: '0.00',
        totalTruckloadsSent: '0.00',
        totalTruckloadsReceived: '0.00',
      });
    }
  }, [saleList]);

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
          label={`Total ${isQuintales ? 'Quintales' : 'Libras'} Disponibles`}
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
          value={formatNumber(
            Number(statistics.totalTruckloadsSent.replace(/,/g, ''))
          )}
          label="Total lb Enviadas"
          backgroundColor={theme.palette.info.main}
          color={theme.palette.info.contrastText}
        />
        <DataItem
          value={formatNumber(
            Number(statistics.totalTruckloadsReceived.replace(/,/g, ''))
          )}
          label="Total lb Recibidas"
          backgroundColor={theme.palette.info.main}
          color={theme.palette.info.contrastText}
        />
      </Box>
    </Box>
  );
};

export default DataTableOverview;
