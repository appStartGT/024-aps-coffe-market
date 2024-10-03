import { cleanModel } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const customerModel = (customer) => {
  const obj = {
    id: customer.id_customer,
    id_customer: customer.id_customer,
    name: customer.name,
    address: customer.address || '',
    email: customer.email || '',
    nit: customer.nit || '',
    phone: customer.phone || '',
    surNames: customer.surNames || '',
    DPI: customer.DPI || '',
    createdAt: formatFirebaseTimestamp(customer.createdAt),
  };
  return obj;
};

export const customerList = (data) => {
  return data.map((item) => customerModel(item));
};

export const customerGetOne = (customer) => customerModel(customer);

export const customerPut = (customer) => {
  const model = customerModel(customer);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model, { allowEmptyStrings: true });
};

export const updateListCustomer = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_customer) {
      return customerModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
