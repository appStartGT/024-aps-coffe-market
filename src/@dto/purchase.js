import { cleanModel, formatNumber } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const purchaseModel = (purchase, purchase_details) => {
  const relevantDetails = (
    purchase_details?.filter(
      (detail) => detail.id_purchase === purchase.id_purchase
    ) || []
  ).map((detail) => ({
    ...detail,
  }));

  const totalAdvancePayments = Number(
    relevantDetails
      .reduce(
        (sum, detail) =>
          sum +
          (detail.advancePayments?.reduce(
            (detailSum, payment) => detailSum + (Number(payment.amount) || 0),
            0
          ) || 0),
        0
      )
      .toFixed(2)
  );

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
          sum +
          (!detail.isPriceless && !detail.isRemate
            ? Number(detail.quantity) || 0
            : 0),
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

  const totalLbRemate = Number(
    relevantDetails
      .reduce(
        (sum, detail) =>
          sum +
          (detail.isRemate && !detail.isPriceless
            ? Number(detail.quantity) || 0
            : 0),
        0
      )
      .toFixed(2)
  );

  const totalLbQuantity = Number(
    (totalLbPriced + totalLbPriceless) /* + totalLbRemate */
      .toFixed(2)
  );

  const averagePrice = Number(
    (totalPricedAmount / (totalLbPriced + totalLbRemate)).toFixed(2)
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

  const obj = {
    id: purchase.id_purchase,
    id_purchase: purchase.id_purchase,
    createdAt: purchase.createdAt,
    createdAtFormat: formatFirebaseTimestamp(purchase.createdAt),
    createdBy: purchase.createdBy || '',
    id_customer: purchase?.id_customer || purchase.customer?.id_customer || '',
    name: purchase?.name || purchase.customer?.name || '',
    surNames: purchase?.surNames || purchase.customer?.surNames || '',
    email: purchase?.email || purchase.customer?.email || '',
    phone: purchase?.phone || purchase.customer?.phone || '',
    nit: purchase?.nit || purchase.customer?.nit || '',
    DPI: purchase?.DPI || purchase.customer?.DPI || '',
    address: purchase?.address || purchase.customer?.address || '',
    isActive: purchase.isActive || false,
    updatedAt: formatFirebaseTimestamp(purchase.updatedAt),
    fullName: `${purchase?.name || purchase.customer?.name} ${
      purchase?.surNames || purchase.customer?.surNames
    }`,
    averagePriceFormatted: `Q ${formatNumber(averagePrice)}`,
    totalAdvancePaymentsFormatted: `Q ${formatNumber(totalAdvancePayments)}`,
    totalLbRemateFormatted: `${formatNumber(totalLbRemate)} lb`,
    totalQQRemateFormatted: `${formatNumber(
      Number((totalLbRemate / 100).toFixed(2))
    )} qq`,
    totalLbPricedFormatted: `${formatNumber(totalLbPriced)} lb`,
    totalQQPricedFormatted: `${formatNumber(
      Number((totalLbPriced / 100).toFixed(2))
    )} qq`,
    totalLbPricelessFormatted: `${formatNumber(totalLbPriceless)} lb`,
    totalQQPricelessFormatted: `${formatNumber(
      Number((totalLbPriceless / 100).toFixed(2))
    )} qq`,
    totalDebtFormatted: `Q ${formatNumber(totalDebt)}`,
    totalPricedAmountFormatted: `Q ${formatNumber(totalPricedAmount)}`,
    totalLbQuantityFormatted: `${formatNumber(totalLbQuantity)} lb`,
    totalQQQuantityFormatted: `${formatNumber(
      Number((totalLbQuantity / 100).toFixed(2))
    )} qq`,
    averagePrice: averagePrice,
    totalAdvancePayments: totalAdvancePayments,
    totalLbRemate: totalLbRemate,
    totalQQRemate: Number((totalLbRemate / 100).toFixed(2)),
    totalLbPriced: totalLbPriced,
    totalQQPriced: Number((totalLbPriced / 100).toFixed(2)),
    totalLbPriceless: totalLbPriceless,
    totalQQPriceless: Number((totalLbPriceless / 100).toFixed(2)),
    totalLbQuantity: totalLbQuantity,
    totalQQQuantity: Number((totalLbQuantity / 100).toFixed(2)),
    totalPricedAmount: totalPricedAmount,

    totalDebt: totalDebt,
  };
  return obj;
};

export const purchaseList = (data, purchase_details) => {
  return data.map((item) => purchaseModel(item, purchase_details));
};

export const purchaseGetOne = (purchase) => purchaseModel(purchase);

export const purchasePut = (purchase) => {
  const model = purchaseModel(purchase);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model);
};

export const updateListPurchase = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_purchase) {
      return purchaseModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
