import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import DataItem from './DataItem';
import { formatNumber } from '@utils';
import { setDataStatistics } from '../../../../store/modules/sale';

const DataTableOverview = ({ saleList }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const purchaseDetailsResult = useSelector(
    (state) => state.sale.purchaseDetailsResult
  );
  const rowPurchaseDetails = useSelector(
    (state) => state.sale.rowPurchaseDetails
  );

  const [statistics, setStatistics] = useState({
    totalLbPriceless: '0.00',
    totalTruckloadsSent: '0.00',
    totalTruckloadsReceived: '0.00',
    totalLbSold: '0.00',
    totalLbAvailable: '0.00',
    totalLbAvailablePriceless: '0.00',
    availableForShipment: '0.00',
  });
  const [isQuintales, setIsQuintales] = useState(false);

  useEffect(() => {
    const calculateStatistics = () => {
      const totalLbPriceless = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalLbPriceless || 0),
        0
      );
      const totalTruckloadsSent = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsSent || 0),
        0
      );
      const totalTruckloadsSentToSubstract = saleList.reduce(
        (sum, sale) => sum + Number(sale.totalTruckloadsSentToSubstract || 0),
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

      const totalLbAvailablePricelessSentToBeneficio =
        purchaseDetailsResult?.totalLbAvailablePricelessSentToBeneficio || 0;

      /*  const totalLbAvailablePriceless =
        purchaseDetailsResult?.totalLbAvailablePriceless || 0; */
      const totalLbAvailable =
        saleList.reduce(
          (sum, sale) => sum + Number(sale.totalTruckloadsReceived || 0),
          0
        ) -
        (purchaseDetailsResult?.totalLbAvailablePricelessSentToBeneficio || 0) -
        totalLbSold; //substract priceless from total available

      let availableForShipment =
        (purchaseDetailsResult?.totalLbAvailablePriceless || 0) +
        (purchaseDetailsResult?.totalLbAvailable || 0) -
        totalTruckloadsSentToSubstract;
      console.log({
        totalLbAvailablePriceless:
          purchaseDetailsResult?.totalLbAvailablePriceless,
        totalLbAvailable: totalLbAvailablePricelessSentToBeneficio,
        totalTruckloadsSentToSubstract: totalTruckloadsSentToSubstract,
        availableForShipment: availableForShipment,
      });
      const result = {
        totalLbPriceless: formatNumber(totalLbPriceless),
        totalTruckloadsSent: formatNumber(totalTruckloadsSent),
        totalTruckloadsReceived: formatNumber(totalTruckloadsReceived),
        totalLbSold: formatNumber(totalLbSold),
        totalLbAvailable: formatNumber(
          totalLbAvailable > 0 ? totalLbAvailable : 0
        ),
        totalLbAvailablePriceless: formatNumber(
          totalLbAvailablePricelessSentToBeneficio
        ),
        availableForShipment: formatNumber(availableForShipment),
      };

      setStatistics(result);
      dispatch(setDataStatistics(result));
    };

    calculateStatistics();
  }, [saleList, purchaseDetailsResult, rowPurchaseDetails]);

  const toggleUnit = () => setIsQuintales(!isQuintales);

  const convertToQuintales = (value) =>
    formatNumber(parseFloat(value.replace(/,/g, '')) / 100);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.availableForShipment)
              : statistics.availableForShipment
          }
          label={`Disponible para envío (${isQuintales ? 'qq' : 'lb'})`}
          backgroundColor={theme.palette.warning.main}
          color={theme.palette.warning.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbAvailablePriceless)
              : statistics.totalLbAvailablePriceless
          }
          label={`Total sin precio ${isQuintales ? '(qq)' : '(lb)'}`}
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
          label={`Total ${isQuintales ? '(qq)' : '(lb)'} ${
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
          label={`Total ${isQuintales ? '(qq)' : '(lb)'} ${
            isQuintales ? 'recibidos' : 'recibidas'
          } en Beneficio`}
          backgroundColor={theme.palette.info.main}
          color={theme.palette.info.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbAvailable)
              : statistics.totalLbAvailable
          }
          label={`Disponible para venta ${isQuintales ? '(qq)' : '(lb)'}`}
          backgroundColor={theme.palette.primary.main}
          color={theme.palette.primary.contrastText}
          onClick={toggleUnit}
        />
        <DataItem
          value={
            isQuintales
              ? convertToQuintales(statistics.totalLbSold)
              : statistics.totalLbSold
          }
          label={`Total ${isQuintales ? '(qq)' : '(lb)'} ${
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
