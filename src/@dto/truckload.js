import { cleanModel, formatNumber } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const truckloadModel = (truckload) => {
  const obj = {
    id: truckload.id_beneficio_truckload,
    id_beneficio_truckload: truckload.id_beneficio_truckload,
    id_sale: truckload?.id_sale,
    createdAt: formatFirebaseTimestamp(truckload.createdAt, 'DD/MM/YYYY:HH:mm'),
    createdBy: truckload.createdBy || '',
    isActive: truckload.isActive || false,
    updatedAt: formatFirebaseTimestamp(truckload.updatedAt),
    id_truckload_remate: truckload?.id_truckload_remate || '',
    id_cat_truckload_license_plate:
      truckload?.id_cat_truckload_license_plate || '',
    totalSent: truckload?.totalSent || 0,
    totalReceived: truckload?.totalReceived || 0,
    colilla: truckload?.colilla || null,
  };
  return obj;
};

const truckloadGetModel = (truckload) => {
  return {
    ...truckloadModel(truckload),
    totalSentFormated: `${formatNumber(truckload.totalSent)} lb`,
    totalReceivedFormated: `${formatNumber(truckload.totalReceived)} lb`,
    colillaUrl: truckload.colilla?.url,
  };
};

export const truckloadList = (data) => {
  return data.map((item) => truckloadGetModel(item));
};

export const truckloadGetOne = (truckload) => truckloadGetModel(truckload);

export const truckloadPut = (truckload) => {
  const model = truckloadModel(truckload);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model);
};

export const updateListTruckload = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_truckload) {
      return truckloadModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
