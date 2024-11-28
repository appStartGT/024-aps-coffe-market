import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Delete, Edit } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Typography } from '@mui/material';
import {
  deleteExpenseAction,
  getExpenseListAction,
  setExpenseAction,
} from '../../../../store/modules/expense';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import ExpenseDetailForm from '../components/ExpenseDetailForm';
import {
  catExpenseTypeCatalogAction,
  paymentMethodCatalogAction,
} from '../../../../store/modules/catalogs';

const useExpensesList = () => {
  /* hooks */
  const dispatch = useDispatch();

  /* selectors */
  const expensesList = useSelector((state) => state.expense.expenseList);
  const totalItems = useSelector((state) => state.expense.totalItems);
  const processing = useSelector((state) => state.expense.processing);
  const id_budget = useSelector((state) => state.budget.budget?.id_budget);
  /* States */
  const [searchList, setSearchList] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState({});
  const [, setText] = useState('');

  /* use Effects */
  useEffect(() => {
    id_budget && dispatch(getExpenseListAction({ id_budget }));
  }, [dispatch, id_budget]);

  useEffect(() => {
    dispatch(catExpenseTypeCatalogAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(paymentMethodCatalogAction());
  }, [dispatch]);

  const handleOpenExpenseDetailModal = (id_expense) => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: id_expense ? 'Detalles' : 'Agregar',
        description: id_expense ? 'Edita los campos.' : 'Ingrese los detalles.',
        content: <ExpenseDetailForm nonupdate={!id_expense} />,
      })
    );
  };

  const columns = [
    {
      field: 'cat_expense_type_name',
      headerName: 'Tipo de Gasto',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'cat_payment_method_name',
      headerName: 'Forma de Pago',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'amountFormatted',
      headerName: 'Total',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Descripción',
      headerAlign: 'center',
      align: 'center',
      minWidth: 150,
      flex: 2,
    },
    {
      field: 'createdAtFormat',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 'fullWidth',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 170,
      sticky: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {params.row.id_expense && (
              <ApsIconButton
                tooltip={{ title: 'Editar registro' }}
                onClick={() => {
                  dispatch(setExpenseAction(params.row));
                  handleOpenExpenseDetailModal(params.row.id_expense);
                }}
                children={<Edit color="" />}
                can={{
                  key: `can-edit-expense-${params.row.id_expense}`,
                  I: Actions.EDIT,
                  a: Subjects.EXPENSES,
                }}
              />
            )}
            {params.row.id_expense && (
              <ApsIconButton
                tooltip={{ title: 'Eliminar egreso' }}
                onClick={() => handleOpenDelete(params.row)}
                children={<Delete color="error" />}
                can={{
                  key: `can-delete-expense-${params.row.id_expense}`,
                  I: Actions.DELETE,
                  a: Subjects.EXPENSES,
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Tipo de Egreso / Descripción',
    type: 'text',
    searchList: expensesList,
    searchKey: 'cat_expense_type_name,description',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => handleOpenExpenseDetailModal(),
      color: 'primary',
      can: {
        key: 'can-create-expense-record',
        I: Actions.CREATE,
        a: Subjects.EXPENSES,
      },
    },
  };

  const handleCloseDelete = () => {
    setExpenseToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setExpenseToDelete(data);
  };

  const handleDelete = () => {
    dispatch(deleteExpenseAction({ id_expense: expenseToDelete.id_expense }));
    setOpenModalDelete(false);
  };

  const propsModalDeleteExpense = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar egreso',
    content: (
      <Typography>{`Está seguro que desea eliminar el egreso "${expenseToDelete.description}" permanentemente?`}</Typography>
    ),
    handleOk: () => handleDelete(),
    titleOk: 'Eliminar',
    handleCancel: () => handleCloseDelete(),
    titleCancel: 'Cancelar',
    okProps: {
      color: 'error',
      endIcon: <Delete />,
    },
  };

  const labels = {
    expenseType: 'Tipo de Gasto',
    createdAtFormat: 'Fecha',
    total: 'Total',
  };
  const fields = ['expenseType', 'createdAtFormat', 'total'];

  return {
    columns,
    expensesList,
    totalItems,
    processing,
    propsModalDeleteExpense,
    propsSearchBarButton,
    searchList,
    setSearchList,
    labels,
    fields,
  };
};

export default useExpensesList;
