import { useFormikFields, useMountEffect } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  createLoanAction,
  updateLoanAction,
  clearLoanAction,
} from '../../../../store/modules/loan';
import { fieldValidations } from '@utils';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';

const useLoanForm = (id_purchase) => {
  /* HOOKS */
  const dispatch = useDispatch();
  /* SELECTORS */
  const processing = useSelector((state) => state.loan.processing);
  const loanSelected = useSelector((state) => state.loan.loan);
  const budget = useSelector((state) => state.budget.budget);
  const cat_payment_method = useSelector(
    (state) => state.catalogs.cat_payment_method
  );
  const id_loan = loanSelected?.id_loan || '0';

  const formikLoan = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Monto',
        name: 'amount',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { type: 'number' },
        validations: fieldValidations.numberRequired,
      },
      {
        id: '3',
        label: 'Forma de Financiamiento',
        name: 'id_cat_payment_method',
        field: 'select',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { as: 'select' },
        options: cat_payment_method,
        validations: fieldValidations.required,
      },
      {
        id: '2',
        label: 'Descripción',
        name: 'description',
        gridItem: true,
        gridProps: { md: 12 },
        multiline: true,
        rows: 4,
        inputProps: { maxLength: 255 },
      },

      {
        id: '4',
        label: 'Marcar como pagado',
        name: 'isPaid',
        field: 'switch',
        gridItem: true,
        gridProps: { md: 12 },
        renderfunction: () => {
          return id_loan !== '0';
        },
      },
    ],
  });

  useMountEffect({
    effect: () => {
      if (loanSelected) {
        formikLoan.form.setValues(loanSelected);
      }
    },
    deps: [loanSelected],
  });

  const handleClose = () => {
    console.log('handleClose');
    formikLoan.clearForm();
    dispatch(clearLoanAction(null));
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const handleOnClick = () => {
    if (id_loan && id_loan !== '0') {
      let body = { ...formikLoan.form.values };
      dispatch(
        updateLoanAction({
          ...body,
          id_loan: id_loan,
          id_budget: budget?.id_budget,
          id_purchase: id_purchase,
        })
      )
        .unwrap()
        .then(() => {
          handleClose();
        });
    } else {
      dispatch(
        createLoanAction({
          ...formikLoan.form.values,
          id_budget: budget?.id_budget,
          id_purchase: id_purchase,
        })
      )
        .unwrap()
        .then(() => {
          handleClose();
        });
    }
  };

  return {
    formikLoan,
    handleOnClick,
    loanSelected,
    processing,
  };
};

export default useLoanForm;
