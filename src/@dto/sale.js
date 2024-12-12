import { cleanModel, formatNumber } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const saleModel = (sale, sale_details, truckloads) => {
  const relevantDetails = (
    sale_details?.filter((detail) => detail.id_sale === sale.id_sale) || []
  ).map((detail) => ({
    ...detail,
  }));
  console.log({ relevantDetails, truckloads });
  const totalPricedAmount = Number(
    relevantDetails
      .reduce(
        (sum, detail) =>
          sum +
          (!detail.isPriceless
            ? Number(detail.quantity) * Number(detail.price) || 0
            : 0),
        0
      )
      .toFixed(2)
  );

  const totalLbPriced = Number(
    relevantDetails
      .reduce(
        (sum, detail) =>
          sum + (!detail.isPriceless ? Number(detail.quantity) || 0 : 0),
        0
      )
      .toFixed(2)
  );

  const totalLbPriceless = Number(
    relevantDetails
      .reduce(
        (sum, detail) =>
          sum +
          (detail.isPriceless && !detail.isRemate
            ? Number(detail.quantity) || 0
            : 0),
        0
      )
      .toFixed(2)
  );

  const totalDebt = Number(
    relevantDetails
      .reduce((sum, detail) => {
        if (
          !detail.isPriceless &&
          !detail.isRemate &&
          detail.advancePayments &&
          detail.advancePayments.length > 0
        ) {
          const detailTotal =
            (Number(detail.quantity) || 0) * (Number(detail.price) || 0);
          const detailAdvances = detail.advancePayments.reduce(
            (total, payment) => total + (Number(payment.amount) || 0),
            0
          );
          return sum + (detailTotal - detailAdvances);
        }
        return sum;
      }, 0)
      .toFixed(2)
  );

  const totalTruckloadsSent = Number(
    truckloads
      ?.reduce(
        (sum, truckload) =>
          truckload.id_sale === sale.id_sale
            ? sum + (Number(truckload.totalSent) || 0)
            : sum,
        0
      )
      .toFixed(2)
  );

  const totalTruckloadsReceived = Number(
    truckloads
      ?.reduce(
        (sum, truckload) =>
          truckload.id_sale === sale.id_sale
            ? sum + (Number(truckload.totalReceived) || 0)
            : sum,
        0
      )
      .toFixed(2)
  );

  const totalLbsSold = Number(
    sale_details
      ?.filter((detail) => detail.id_sale === sale.id_sale)
      .reduce((sum, detail) => sum + (Number(detail.quantity) || 0), 0)
      .toFixed(2)
  );

  const obj = {
    id: sale.id_sale,
    id_sale: sale.id_sale,
    createdAt: sale.createdAt,
    createdAtFormat: formatFirebaseTimestamp(sale.createdAt),
    createdBy: sale.createdBy || '',
    id_beneficio: sale?.id_beneficio || sale.beneficio?.id_beneficio || '',
    name: sale?.name || sale.beneficio?.name || '',
    email: sale?.email || sale.beneficio?.email || '',
    phone: sale?.phone || sale.beneficio?.phone || '',
    nit: sale?.nit || sale.beneficio?.nit || '',
    DPI: sale?.DPI || sale.beneficio?.DPI || '',
    address: sale?.address || sale.beneficio?.address || '',
    isActive: sale.isActive || false,
    updatedAt: formatFirebaseTimestamp(sale.updatedAt),
    totalLbPricedFormatted: formatNumber(totalLbPriced),
    totalLbPricelessFormatted: formatNumber(totalLbPriceless),
    totalDebtFormatted: `Q ${formatNumber(totalDebt)}`,
    totalPricedAmountFormatted: formatNumber(totalPricedAmount),
    totalLbPriced: totalLbPriced,
    totalLbPriceless: totalLbPriceless,
    totalPricedAmount: totalPricedAmount,
    totalDebt: totalDebt,
    totalTruckloadsSent: totalTruckloadsSent,
    totalTruckloadsSentFormatted: `${formatNumber(totalTruckloadsSent)} lb`,
    totalTruckloadsSentQQFormatted: `${formatNumber(
      Number((totalTruckloadsSent / 100).toFixed(2))
    )} qq`,
    totalTruckloadsReceived: totalTruckloadsReceived,
    totalTruckloadsReceivedFormatted: `${formatNumber(
      totalTruckloadsReceived
    )} lb`,
    totalTruckloadsReceivedQQFormatted: `${formatNumber(
      Number((totalTruckloadsReceived / 100).toFixed(2))
    )} qq`,
    totalLbsSold: totalLbsSold,
    totalLbsSoldFormatted: `${formatNumber(totalLbsSold)} lb`,
    totalQQSold: Number((totalLbsSold / 100).toFixed(2)),
    totalQQSoldFormatted: `${formatNumber(
      Number((totalLbsSold / 100).toFixed(2))
    )} qq`,
  };
  return obj;
};

const calculatePurchaseDetailsResult = (purchase_details) => {
  const totalLbAvailable = Number(
    purchase_details
      ?.filter((detail) => !detail.isPriceless && !detail.isSold)
      .reduce((sum, detail) => sum + (Number(detail.quantity) || 0), 0)
      .toFixed(2)
  );
  const totalLbAvailablePriceless = Number(
    purchase_details
      ?.filter(
        (detail) =>
          detail.isPriceless && !detail.isRemate /* && !detail.isSold */
      )
      .reduce((sum, detail) => sum + (Number(detail.quantity) || 0), 0)
      .toFixed(2)
  );

  return {
    totalLbAvailable: totalLbAvailable,
    totalLbAvailableFormatted: `${formatNumber(totalLbAvailable)} lb`,
    totalQQAvailable: Number((totalLbAvailable / 100).toFixed(2)),
    totalQQAvailableFormatted: `${formatNumber(
      Number((totalLbAvailable / 100).toFixed(2))
    )} qq`,
    totalLbAvailablePriceless: totalLbAvailablePriceless,
    totalLbAvailablePricelessFormatted: `${formatNumber(
      totalLbAvailablePriceless
    )} lb`,
    totalQQAvailablePriceless: Number(
      (totalLbAvailablePriceless / 100).toFixed(2)
    ),
    totalQQAvailablePricelessFormatted: `${formatNumber(
      Number((totalLbAvailablePriceless / 100).toFixed(2))
    )} qq`,
  };
};

export const saleList = (data, sale_details, truckloads, purchase_details) => {
  return {
    saleList: data.map((item) =>
      saleModel(item, sale_details, truckloads, purchase_details)
    ),
    purchaseDetailsResult: calculatePurchaseDetailsResult(purchase_details),
  };
};

export const saleGetOne = (sale) => saleModel(sale);

export const salePut = (sale) => {
  const model = saleModel(sale);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model);
};

export const updateListSale = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_sale) {
      return saleModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
