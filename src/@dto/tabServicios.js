import moment from 'moment';

export const listHospitalizacion = (data) => {
  return data.map((item) => {
    return {
      ...parseServicios(item),
    };
  });
};

export const parseServicios = (th) => {
  return {
    id: th.id_services_fee,
    id_services_record: th.id_services_record,
    description: th.description || '',
    createdAt: moment(th.createdAt).format('DD/MM/YYYY'),
    amount: th.amount,
  };
};

export const updateServicios = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_services_fee) {
      return parseServicios({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
