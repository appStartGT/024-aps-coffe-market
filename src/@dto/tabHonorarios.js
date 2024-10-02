import moment from 'moment';

export const listHonorario = (data) => {
  return data.map((item) => {
    return {
      ...parseHonorario(item),
    };
  });
};

export const parseHonorario = (th) => {
  return {
    id: th.id_transaction_fee,
    id_services_record: th.id_services_record,
    id_person: th.id_person,
    description: th.description || '',
    createdAt: moment(th.createdAt).format('DD/MM/YYYY'),
    amount: th.amount,
    name: `${th.person.names} ${th.person.surNames}`,
  };
};

export const updateHonorario = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_transaction_fee) {
      return parseHonorario({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
