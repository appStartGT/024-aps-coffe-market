import moment from 'moment';

export const listLaboratory = (data) => {
  return data.map((item) => {
    return {
      ...parseLaboratory(item),
    };
  });
};

export const parseLaboratory = (tl) => {
  return {
    id: tl.id_service_charge,
    id_services_record: tl.id_services_record,
    description: tl.description || '',
    createdAt: moment(tl.createdAt).format('DD/MM/YYYY'),
    amount: tl.amount || '',
  };
};

export const updateLaboratory = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_service_charge) {
      return parseLaboratory({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
