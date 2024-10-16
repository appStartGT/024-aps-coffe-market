import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const purchaseModel = (purchase) => {
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
    key: purchase.key || '',
    updatedAt: formatFirebaseTimestamp(purchase.updatedAt),
    fullName: `${purchase?.name || purchase.customer?.name} ${
      purchase?.surNames || purchase.customer?.surNames
    }`,
  };
  return obj;
};

export const purchaseList = (data) => {
  return data.map((item) => purchaseModel(item));
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
