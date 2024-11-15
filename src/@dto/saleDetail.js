import { formatNumber, cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const saleDetailModel = (saleDetail) => {
  const obj = {
    id: saleDetail.id_sale_detail,
    id_sale_detail: saleDetail.id_sale_detail,
    id_sale: saleDetail?.id_sale,
    priceFormat: `Q${formatNumber(saleDetail?.price)}`,
    price: saleDetail?.price,
    quantity: saleDetail?.quantity,
    quantityFormated: `${formatNumber(saleDetail?.quantity)} lb`,
    quantityQQFormated: `${formatNumber(saleDetail?.quantity / 100)} qq`,
    total: saleDetail?.total,
    totalFormat: `Q${formatNumber(saleDetail?.quantity * saleDetail?.price)}`,
    isPriceless: saleDetail?.isPriceless,
    createdAt: formatFirebaseTimestamp(
      saleDetail.createdAt,
      'DD/MM/YYYY HH:mm'
    ),
    createdBy: saleDetail.createdBy || '',
    isActive: saleDetail.isActive || false,
    updatedAt: formatFirebaseTimestamp(saleDetail.updatedAt),
    id_sale_detail_remate: saleDetail?.id_sale_detail_remate || '',
  };
  return obj;
};

export const saleDetailList = (data) => {
  return data.map((item) => saleDetailModel(item));
};

export const saleDetailGetOne = (saleDetail) => saleDetailModel(saleDetail);

export const saleDetailPut = (saleDetail) => {
  const model = saleDetailModel(saleDetail);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model);
};

export const updateListSaleDetail = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_sale_detail) {
      return saleDetailModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
