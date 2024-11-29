import { cleanModel, formatNumber } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const loanModel = (loan) => {
  if (!loan) return {};
  const obj = {
    id: loan.id,
    id_loan: loan?.id_loan,
    amount: loan.amount,
    amountFormatted: `Q ${formatNumber(loan.amount)}`,
    description: loan.description || '',
    isPaid: Boolean(loan.isPaid),
    createdAt: loan.createdAt,
    createdAtFormat: formatFirebaseTimestamp(
      loan.createdAt,
      'DD/MM/YYYY HH:mm'
    ),
    id_cat_payment_method: loan.id_cat_payment_method,
    createdBy: loan.createdBy || '',
    updatedAt: formatFirebaseTimestamp(loan.updatedAt),
  };
  return obj;
};

export const loanList = (data) => {
  return data.map((item) => loanModel(item));
};

export const loanGetOne = (loan) => loanModel(loan);

export const loanPut = (loan) => {
  const model = loanModel(loan);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model);
};

export const loanPost = (loan) => {
  const model = {
    amount: loan.amount,
    description: loan.description || '',
    isPaid: Boolean(loan.isPaid),
    id_budget: loan.id_budget,
    id_purchase: loan.id_purchase,
    id_cat_payment_method: loan.id_cat_payment_method,
  };
  return cleanModel(model);
};

export const updateListLoan = (oldData, updatedEntry) => {
  return oldData.map((cl) => {
    if (cl.id == updatedEntry.id_loan) {
      return loanModel({
        ...updatedEntry,
      });
    } else {
      return cl;
    }
  });
};
