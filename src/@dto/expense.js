import { cleanModel, formatNumber } from '@utils';
import { formatFirebaseTimestamp } from '@utils/dates';

const expenseModel = (expense) => {
  if (!expense) return {};
  const obj = {
    id: expense.id,
    id_expense: expense?.id_expense,
    amount: expense.amount,
    amountFormatted: `Q ${formatNumber(expense.amount)}`,
    description: expense.description || '',
    id_cat_expense_type: expense.id_cat_expense_type || undefined,
    cat_expense_type: expense.cat_expense_type || undefined,
    cat_expense_type_name: expense.cat_expense_type?.name || '',
    createdAt: expense.createdAt,
    createdAtFormat: formatFirebaseTimestamp(expense.createdAt),
    createdBy: expense.createdBy || '',
    updatedAt: formatFirebaseTimestamp(expense.updatedAt),
  };
  return obj;
};

export const expenseList = (data) => {
  return data.map((item) => expenseModel(item));
};

export const expenseGetOne = (expense) => expenseModel(expense);

export const expensePut = (expense) => {
  const model = expenseModel(expense);
  delete model.createdAt;
  delete model.id;
  return cleanModel(model);
};

export const updateListExpense = (oldData, updatedEntry) => {
  return oldData.map((ce) => {
    if (ce.id == updatedEntry.id_expense) {
      return expenseModel({
        ...updatedEntry,
      });
    } else {
      return ce;
    }
  });
};
