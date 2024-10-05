import { calculateTotal, cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const purchaseDetailModel = (purchaseDetail) => {
  const obj = {
    id: purchaseDetail.id_purchase_detail,
    id_purchase_detail: purchaseDetail.id_purchase_detail,
    id_purchase: purchaseDetail?.id_purchase,
    price: `Q${purchaseDetail?.price}`,
    quantity: purchaseDetail?.quantity,
    total: `Q${calculateTotal(
      purchaseDetail?.quantity,
      purchaseDetail?.price
    )}`,
    isPriceless: purchaseDetail?.isPriceless,
    id_cat_payment_method: purchaseDetail?.id_cat_payment_method,
    createdAt: formatFirebaseTimestamp(purchaseDetail.createdAt),
    createdBy: purchaseDetail.createdBy || '',
    isActive: purchaseDetail.isActive || false,
    key: purchaseDetail.key || '',
    updatedAt: formatFirebaseTimestamp(purchaseDetail.updatedAt),
  };
  return obj;
};

export const purchaseDetailList = (data) => {
  return data.map((item) => purchaseDetailModel(item));
};

export const purchaseDetailGetOne = (purchaseDetail) =>
  purchaseDetailModel(purchaseDetail);

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
