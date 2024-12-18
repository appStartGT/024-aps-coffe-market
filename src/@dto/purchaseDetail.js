import { formatNumber, cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const purchaseDetailModel = (purchaseDetail, purchaseSelected) => {
  const obj = {
    id: purchaseDetail.id_purchase_detail,
    id_purchase_detail: purchaseDetail.id_purchase_detail,
    id_purchase: purchaseDetail?.id_purchase,
    id_budget: purchaseDetail?.id_budget,
    budgetDate: formatFirebaseTimestamp(purchaseDetail?.budget?.createdAt),
    budgetIsClosed: purchaseDetail?.budget?.isClosed,
    priceFormat: `Q${formatNumber(purchaseDetail?.price)}`,
    price: purchaseDetail?.price,
    quantity: purchaseDetail?.quantity,
    quantityFormated: `${formatNumber(purchaseDetail?.quantity)} lb`,
    quantityQQFormated: `${formatNumber(purchaseDetail?.quantity / 100)} qq`,
    total: purchaseDetail?.total,
    totalFormat: `Q${formatNumber(
      purchaseDetail?.quantity * purchaseDetail?.price
    )}`,
    isPriceless: purchaseDetail?.isPriceless,
    isPendingPayment: purchaseDetail?.isPendingPayment,
    id_cat_payment_method: purchaseDetail?.id_cat_payment_method,
    createdAt: formatFirebaseTimestamp(
      purchaseDetail.createdAt,
      'DD/MM/YYYY HH:mm'
    ),
    createdBy: purchaseDetail.createdBy || '',
    isActive: purchaseDetail.isActive || false,
    key: purchaseDetail.key || '',
    updatedAt: formatFirebaseTimestamp(purchaseDetail.updatedAt),
    advancePayments: purchaseDetail?.advancePayments || [],
    advancePaymentAmount: `Q${formatNumber(
      purchaseDetail?.advancePayments?.reduce(
        (sum, payment) => sum + (payment.amount || 0),
        0
      )
    )}`,
    isPaid:
      !purchaseDetail.isPriceless &&
      (!purchaseDetail?.advancePayments?.length ||
        purchaseDetail?.advancePayments?.reduce(
          (sum, payment) => sum + (payment.amount || 0),
          0
        ) ===
          purchaseDetail?.quantity * purchaseDetail?.price),
    isRemate: purchaseDetail?.isRemate || false,
    id_purchase_detail_remate: purchaseDetail?.id_purchase_detail_remate || '',
    isSold: purchaseDetail?.isSold || false,
    customerName: purchaseSelected?.fullName || '',
    paidWithBudget: purchaseDetail?.paidWithBudget,
  };
  return obj;
};

export const purchaseDetailList = (data, purchaseSelected) => {
  return data
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((item) => purchaseDetailModel({ ...item }, purchaseSelected));
};

export const purchaseDetailGetOne = (purchaseDetail, purchaseSelected) =>
  purchaseDetailModel(purchaseDetail, purchaseSelected);

export const purchaseDetailPut = (purchaseDetail) => {
  const model = purchaseDetailModel(purchaseDetail);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model);
};

export const updateListPurchaseDetail = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_purchase_detail) {
      return purchaseDetailModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
