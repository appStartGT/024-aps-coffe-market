import { useFormikFields, useMountEffect } from '@hooks';
import { useDispatch } from 'react-redux';
import {
  createExpenseAction,
  updateExpenseAction,
  setExpenseAction,
} from '../../../../store/modules/expense';
import { fieldValidations } from '@utils';
import { useSelector } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';

const useExpenseForm = () => {
  /* HOOKS */
  const dispatch = useDispatch();

  /* SELECTORS */
  const processing = useSelector((state) => state.expense.processing);
  const expenseSelected = useSelector((state) => state.expense.expense);
  const catExpenseType = useSelector((state) => state.catalogs.catExpenseType);
  const budget = useSelector((state) => state.budget.budget);
  const id_expense = expenseSelected?.id_expense || '0';

  const formikExpense = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Tipo de gasto',
        name: 'id_cat_expense_type',
        field: 'select',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { as: 'select' },
        options: catExpenseType,
        validations: fieldValidations.required,
      },
      {
        id: '2',
        label: 'Total',
        name: 'amount',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { type: 'number' },
        validations: fieldValidations.required,
      },
      {
        id: '3',
        label: 'Descripción',
        name: 'description',
        gridItem: true,
        gridProps: { md: 12 },
        multiline: true,
        rows: 4,
        inputProps: { maxLength: 255 },
      },
    ],
  });

  useMountEffect({
    effect: () => {
      if (expenseSelected) {
        formikExpense.form.setValues(expenseSelected);
      }
    },
    deps: [expenseSelected],
  });

  const handleClose = () => {
    formikExpense.clearForm();
    dispatch(setExpenseAction(null));
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const handleOnclick = () => {
    if (id_expense && id_expense !== '0') {
      let body = { ...formikExpense.form.values };
      dispatch(
        updateExpenseAction({
          ...body,
          id_expense: id_expense,
          id_budget: budget?.id_budget,
        })
      )
        .unwrap()
        .then(() => {
          handleClose();
        });
    } else {
      dispatch(
        createExpenseAction({
          ...formikExpense.form.values,
          id_budget: budget?.id_budget,
        })
      )
        .unwrap()
        .then(() => {
          handleClose();
        });
    }
  };

  return {
    formikExpense,
    handleOnclick,
    expenseSelected,
    processing,
  };
};

export default useExpenseForm;
