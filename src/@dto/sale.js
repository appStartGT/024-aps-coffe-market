import { cleanModel, formatNumber } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const saleModel = (sale, sale_details, truckloads) => {
  const relevantDetails = (
    sale_details?.filter((detail) => detail.id_sale === sale.id_sale) || []
  ).map((detail) => ({
    ...detail,
  }));

  const totalAdvancePayments = relevantDetails.reduce(
    (sum, detail) =>
      sum +
      (detail.advancePayments?.reduce(
        (detailSum, payment) => detailSum + (Number(payment.amount) || 0),
        0
      ) || 0),
    0
  );

  const totalPricedAmount = relevantDetails.reduce(
    (sum, detail) =>
      sum +
      (!detail.isPriceless
        ? Number(detail.quantity) * Number(detail.price) || 0
        : 0),
    0
  );

  const totalLbPriced = relevantDetails.reduce(
    (sum, detail) =>
      sum +
      (!detail.isPriceless && !detail.isRemate
        ? Number(detail.quantity) || 0
        : 0),
    0
  );

  const totalLbPriceless = relevantDetails.reduce(
    (sum, detail) =>
      sum +
      (detail.isPriceless && !detail.isRemate
        ? Number(detail.quantity) || 0
        : 0),
    0
  );

  const totalLbRemate = relevantDetails.reduce(
    (sum, detail) =>
      sum +
      (detail.isRemate && !detail.isPriceless
        ? Number(detail.quantity) || 0
        : 0),
    0
  );

  const totalLbQuantity = totalLbPriced + totalLbPriceless + totalLbRemate;

  const averagePrice =
    totalLbPriced > 0 ? totalPricedAmount / (totalLbPriced + totalLbRemate) : 0;

  const totalDebt = relevantDetails.reduce((sum, detail) => {
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
  }, 0);

  const totalTruckloadsSent = truckloads?.reduce(
    (sum, truckload) =>
      truckload.id_sale === sale.id_sale
        ? sum + (Number(truckload.totalSent) || 0)
        : sum,
    0
  );

  const totalTruckloadsReceived = truckloads?.reduce(
    (sum, truckload) =>
      truckload.id_sale === sale.id_sale
        ? sum + (Number(truckload.totalReceived) || 0)
        : sum,
    0
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
    averagePriceFormatted: `Q ${formatNumber(averagePrice)}`,
    totalAdvancePaymentsFormatted: `Q ${formatNumber(totalAdvancePayments)}`,
    totalLbRemateFormatted: formatNumber(totalLbRemate),
    totalLbPricedFormatted: formatNumber(totalLbPriced),
    totalLbPricelessFormatted: formatNumber(totalLbPriceless),
    totalDebtFormatted: `Q ${formatNumber(totalDebt)}`,
    totalPricedAmountFormatted: formatNumber(totalPricedAmount),
    averagePrice: averagePrice,
    totalAdvancePayments: totalAdvancePayments,
    totalLbRemate: totalLbRemate,
    totalLbPriced: totalLbPriced,
    totalLbPriceless: totalLbPriceless,
    totalLbQuantity: totalLbQuantity,
    totalPricedAmount: totalPricedAmount,
    totalDebt: totalDebt,
    totalTruckloadsSent: totalTruckloadsSent,
    totalTruckloadsReceived: totalTruckloadsReceived,
  };
  return obj;
};

export const saleList = (data, sale_details, truckloads) => {
  return data.map((item) => saleModel(item, sale_details, truckloads));
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
