import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const beneficioModel = (beneficio) => {
  const obj = {
    id: beneficio.id_beneficio,
    id_beneficio: beneficio.id_beneficio,
    name: beneficio.name,
    address: beneficio.address || '',
    email: beneficio.email || '',
    nit: beneficio.nit || '',
    phone: beneficio.phone || '',
    surNames: beneficio.surNames || '',
    DPI: beneficio.DPI || '',
    createdAt: formatFirebaseTimestamp(beneficio.createdAt),
  };
  return obj;
};

export const beneficioList = (data) => {
  return data.map((item) => beneficioModel(item));
};

export const beneficioGetOne = (beneficio) => beneficioModel(beneficio);

export const beneficioPut = (beneficio) => {
  const model = beneficioModel(beneficio);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model, { allowEmptyStrings: true });
};

export const updateListBeneficio = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_beneficio) {
      return beneficioModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
