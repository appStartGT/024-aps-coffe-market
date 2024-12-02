import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Delete, Edit } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Chip, Tooltip, Typography } from '@mui/material';
import {
  clearLoanAction,
  deleteLoanAction,
  getLoanListAction,
  setLoanAction,
} from '../../../../store/modules/loan';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import { Actions, Subjects } from '@config/permissions';
import LoanDetailForm from '../components/LoanDetailForm';
import {
  catLoanTypeCatalogAction,
  paymentMethodCatalogAction,
} from '../../../../store/modules/catalogs';
import { useParams } from 'react-router-dom';

const useLoanList = () => {
  /* hooks */
  const dispatch = useDispatch();
  const { id_purchase } = useParams();
  /* selectors */
  const loanList = useSelector((state) => state.loan.loanList);
  const totalItems = useSelector((state) => state.loan.totalItems);
  const processing = useSelector((state) => state.loan.processing);
  const id_budget = useSelector((state) => state.budget.budget?.id_budget);
  const selectedBudget = useSelector((state) => state.budget.selectedBudget);
  /* States */
  const [searchList, setSearchList] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState({});
  const [, setText] = useState('');
  const [getAll, setGetAll] = useState(false);

  /* use Effects */
  useEffect(() => {
    if (getAll) {
      dispatch(getLoanListAction({ id_purchase, getAll }));
    } else {
      id_budget &&
        dispatch(
          getLoanListAction({
            id_budget: selectedBudget || id_budget,
            id_purchase,
            force: Boolean(selectedBudget),
          })
        );
    }
  }, [dispatch, id_budget, id_purchase, getAll]);

  useEffect(() => {
    dispatch(catLoanTypeCatalogAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(paymentMethodCatalogAction());
  }, [dispatch]);

  const handleOpenLoanDetailModal = (id_loan) => {
    dispatch(
      setApsGlobalModalPropsAction({
        open: true,
        maxWidth: 'xs',
        title: id_loan ? 'Detalle de Préstamo' : 'Agregar Préstamo',
        description: id_loan
          ? 'Edite los detalles del préstamo'
          : 'Ingrese los detalles del nuevo préstamo',
        content: (
          <LoanDetailForm nonupdate={!id_loan} id_purchase={id_purchase} />
        ),
        onClose: () => {
          dispatch(clearLoanAction());
          dispatch(
            setApsGlobalModalPropsAction({ open: false, content: null })
          );
        },
      })
    );
  };

  const columns = [
    {
      field: 'amountFormatted',
      headerName: 'Monto',
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
      field: 'isPaid',
      headerName: 'Estado',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Chip
            color={params.row.isPaid ? 'success' : 'error'}
            label={params.row.isPaid ? 'Pagado' : 'Pendiente'}
          />
        );
      },
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
      field: 'budgetDate',
      headerName: 'Presupuesto',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip
          title={
            params.row.budgetIsClosed
              ? 'Presupuesto cerrado'
              : 'Presupuesto abierto'
          }
        >
          <Chip
            label={params.row.budgetDate ? params.row.budgetDate : '-'}
            color={params.row.budgetIsClosed ? 'error' : 'success'}
          />
        </Tooltip>
      ),
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
            {params.row.id_loan && (
              <ApsIconButton
                tooltip={{ title: 'Editar registro' }}
                onClick={() => {
                  dispatch(setLoanAction(params.row));
                  handleOpenLoanDetailModal(params.row.id_loan);
                }}
                children={<Edit color="" />}
                can={{
                  key: `can-edit-loan-${params.row.id_loan}`,
                  I: Actions.EDIT,
                  a: Subjects.LOANS,
                }}
              />
            )}
            {params.row.id_loan && (
              <ApsIconButton
                tooltip={{ title: 'Eliminar préstamo' }}
                onClick={() => handleOpenDelete(params.row)}
                children={<Delete color="error" />}
                can={{
                  key: `can-delete-loan-${params.row.id_loan}`,
                  I: Actions.DELETE,
                  a: Subjects.LOANS,
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Descripción',
    type: 'text',
    searchList: loanList,
    searchKey: 'description',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => handleOpenLoanDetailModal(),
      color: 'primary',
      can: {
        key: 'can-create-loan-record',
        I: Actions.CREATE,
        a: Subjects.LOANS,
      },
    },
  };

  const handleCloseDelete = () => {
    setLoanToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setLoanToDelete(data);
  };

  const handleDelete = () => {
    dispatch(deleteLoanAction({ id_loan: loanToDelete.id_loan }));
    setOpenModalDelete(false);
  };

  const propsModalDeleteLoan = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar préstamo',
    content: (
      <Typography>{`Está seguro que desea eliminar el préstamo "${loanToDelete.description}" permanentemente?`}</Typography>
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
    loanType: 'Tipo de Préstamo',
    createdAtFormat: 'Fecha',
    amount: 'Monto',
  };
  const fields = ['loanType', 'createdAtFormat', 'amount'];

  return {
    columns,
    loanList,
    totalItems,
    processing,
    propsModalDeleteLoan,
    propsSearchBarButton,
    searchList,
    setSearchList,
    labels,
    fields,
    getAll,
    setGetAll,
  };
};

export default useLoanList;
