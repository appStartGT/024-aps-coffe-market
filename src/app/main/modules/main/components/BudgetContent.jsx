import React, { useEffect, useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  createBudgetAction,
  addBudgetItemAction,
  deleteBudgetItemAction,
  updateBudgetItemAction,
} from '../../../../store/modules/budget';
import { useAuth } from '@hooks';
import { catRubroCatalogAction } from '../../../../store/modules/catalogs';
import NewBudgetDialog from './budget/NewBudgetDialog';
import ItemDialog from './budget/ItemDialog';
import CollapsibleSection from './budget/CollapsibleSection';
import Egresos from './budget/Egresos';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseListAction } from '../../../../store/modules/purchase';
// Main Budget Content Component
const BudgetContent = () => {
  const dispatch = useDispatch();
  const [openBudget, setOpenBudget] = useState(false);
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  const [openBalance, setOpenBalance] = useState(false);
  const auth = useAuth();
  // Get budget data from Redux store
  const budget = useSelector((state) => state.budget.budget);
  const budget_items = useSelector((state) => state.budget.budget_items);
  const expense_purchaseDetails = useSelector(
    (state) => state.budget.expenses.purchaseDetails
  );
  const expense_expenses = useSelector(
    (state) => state.budget.expenses.expenses
  );
  const expense_loans = useSelector((state) => state.budget.expenses.loans);
  const cat_rubro = useSelector((state) => state.catalogs.cat_rubro);

  const allExpenses = {
    ...expense_purchaseDetails,
    ...expense_expenses,
    ...expense_loans,
  };

  useEffect(() => {
    dispatch(catRubroCatalogAction());
  }, [dispatch]);

  const handleNewItem = () => {
    setEditingItem(null);
    setOpenNewItemDialog(true);
  };

  const handleEditItem = (item) => {
    if (!item.isInitial) {
      setEditingItem(item);
      setOpenNewItemDialog(true);
    }
  };

  const handleDeleteItem = (itemToDelete, isBudget) => {
    if (!itemToDelete.isInitial) {
      dispatch(
        deleteBudgetItemAction({
          id_budget_item: itemToDelete.id_budget_item,
          isBudget,
        })
      );
    }
  };

  const handleSaveNewItem = (formData) => {
    const newItemWithId = {
      id_budget: budget?.id_budget,
      ...formData,
    };

    if (editingItem && !editingItem.isInitial) {
      dispatch(
        updateBudgetItemAction({
          ...newItemWithId,
          id_budget_item: editingItem.id_budget_item,
        })
      )
        .then(() => {
          setOpenNewItemDialog(false);
          setEditingItem(null);
        })
        .catch((error) => {
          console.error('Error al actualizar ítem del presupuesto:', error);
        });
    } else if (!editingItem) {
      dispatch(addBudgetItemAction(newItemWithId))
        .then(() => {
          setOpenNewItemDialog(false);
        })
        .catch((error) => {
          console.error('Error al agregar ítem al presupuesto:', error);
        });
    }
  };

  const calculateTotal = (items) => {
    if (!Array.isArray(items)) {
      return 0;
    }
    return items.reduce((sum, item) => sum + Number(item.amount), 0);
  };
  const budgetTotal = calculateTotal(budget_items || []);
  const expenseTotal =
    calculateTotal(
      Object.values(expense_purchaseDetails || {}).flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          amount:
            Number(item.price || 0) * Number(item.quantity || 0) -
            (item.advancePayment || []).reduce(
              (total, payment) => total + Number(payment.amount || 0),
              0
            ),
        }))
      )
    ) +
    calculateTotal(
      Object.values(expense_expenses || {}).flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          amount: Number(item.amount || 0),
        }))
      )
    ) +
    calculateTotal(
      Object.values(expense_loans || {}).flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          amount: Number(item.amount || 0),
        }))
      )
    ) +
    (expense_purchaseDetails?.Anticipos?.total || 0);

  let transferenciasTotal = Object.values(
    //items with amount
    { ...expense_expenses, ...expense_loans } || {}
  )
    .flatMap((group) => group.items)
    .reduce((sum, item) => {
      return item.cat_payment_method.name === 'Transferencia'
        ? sum + Number(item.amount || 0)
        : sum;
    }, 0);

  const purchaseTransferenciasTotal = Object.values(
    expense_purchaseDetails || {}
  )
    .flatMap((group) => group.items)
    .reduce((sum, item) => {
      const advancePaymentTotal = (item.advancePayment || []).reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
      );
      return item.cat_payment_method.name === 'Transferencia'
        ? sum +
            Number(item.price || 0) * Number(item.quantity || 0) -
            advancePaymentTotal
        : sum;
    }, 0);

  transferenciasTotal = transferenciasTotal + purchaseTransferenciasTotal;

  const balance = budgetTotal - expenseTotal;

  const handleNewBudget = () => {
    setOpenNewBudgetDialog(true);
  };

  const handleConfirmNewBudget = (rubroBalances) => {
    const newBudgetItems = Object.entries(rubroBalances)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        id_cat_rubro: cat_rubro.find((rubro) => rubro.label === key)?.value,
        amount: value,
      }));

    dispatch(
      createBudgetAction({
        createdBy: auth.user?.id_user || '',
        budgetItems: newBudgetItems,
      })
    )
      .then(({ payload: { budget } }) => {
        setOpenNewBudgetDialog(false);
        dispatch(
          purchaseListAction({ id_budget: budget?.id_budget, force: true })
        );
      })
      .catch((error) => {
        console.error('Error al crear nuevo presupuesto:', error);
      });
  };

  const calculateRubroBalance = () => {
    const rubroBalances = {};

    // Calculate budget amounts for each rubro
    if (budget_items && Array.isArray(budget_items)) {
      budget_items.forEach((item) => {
        if (item && item.id_cat_rubro) {
          if (!rubroBalances[item.id_cat_rubro]) {
            rubroBalances[item.id_cat_rubro] = 0;
          }
          rubroBalances[item.id_cat_rubro] += Number(item.amount || 0);
        }
      });
    }

    // Subtract expenses for each rubro
    if (expense_expenses && typeof expense_expenses === 'object') {
      Object.values(expense_expenses).forEach((group) => {
        if (group && Array.isArray(group.items)) {
          group.items.forEach((item) => {
            if (item && item.id_cat_rubro) {
              if (!rubroBalances[item.id_cat_rubro]) {
                rubroBalances[item.id_cat_rubro] = 0;
              }
              rubroBalances[item.id_cat_rubro] -= Number(item.amount || 0);
            }
          });
        }
      });
    }
    // Subtract Transferencias from Bancos
    if (transferenciasTotal > 0) {
      const bancosRubro =
        cat_rubro &&
        cat_rubro.find((rubro) => rubro && rubro.label === 'Bancos')?.value;
      if (bancosRubro && rubroBalances[bancosRubro]) {
        rubroBalances[bancosRubro] -= Number(transferenciasTotal || 0);
      }
    }

    // Subtract the rest of the expenses from Efectivo
    const efectivoRubro =
      cat_rubro &&
      cat_rubro.find((rubro) => rubro && rubro.label === 'Efectivo')?.value;
    if (efectivoRubro && rubroBalances[efectivoRubro]) {
      const totalOtherExpenses = allExpenses
        ? Object.values(allExpenses).reduce(
            (sum, group) => sum + Number(group?.total || 0),
            0
          ) - Number(transferenciasTotal || 0)
        : 0; // Exclude Transferencias as they're already subtracted from Bancos
      rubroBalances[efectivoRubro] -= totalOtherExpenses;
    }

    return rubroBalances;
  };

  const rubroBalances = calculateRubroBalance();

  // Check if the sum of Efectivo and Bancos matches the total balance
  const efectivoRubro = cat_rubro.find(
    (rubro) => rubro.label === 'Efectivo'
  )?.value;
  const bancosRubro = cat_rubro.find(
    (rubro) => rubro.label === 'Bancos'
  )?.value;
  const efectivoBalance = rubroBalances[efectivoRubro] || 0;
  const bancosBalance = rubroBalances[bancosRubro] || 0;
  const totalEfectivoBancos = efectivoBalance + bancosBalance;

  if (Math.abs(totalEfectivoBancos - balance) > 0.01) {
    console.warn(
      'La suma de Efectivo y Bancos no coincide con el saldo total.'
    );
    console.log('Saldo total:', balance);
    console.log('Suma de Efectivo y Bancos:', totalEfectivoBancos);
    console.log('Diferencia:', balance - totalEfectivoBancos);
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
      {!budget?.isClosed && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleNewBudget}
          >
            Nuevo Presupuesto
          </Button>
        </Stack>
      )}

      <CollapsibleSection
        title="Presupuesto"
        total={budgetTotal}
        isOpen={openBudget}
        onToggle={() => setOpenBudget(!openBudget)}
        items={budget_items || []}
        onEdit={handleEditItem}
        onDelete={(item) => handleDeleteItem(item, true)}
        showAddButton={!budget?.isClosed}
        onAdd={handleNewItem}
        backgroundColor="rgba(25, 118, 210, 0.08)"
        id_budget={budget?.id_budget}
        cat_rubro={cat_rubro}
        hideButtons={budget?.isClosed}
      />

      <Egresos
        expenseTotal={expenseTotal}
        expense_purchaseDetails={expense_purchaseDetails}
        expense_expenses={expense_expenses}
        expense_loans={expense_loans}
      />

      <Paper
        elevation={2}
        sx={{
          // p: 2,
          backgroundColor:
            balance >= 0
              ? 'rgba(76, 175, 80, 0.08)'
              : 'rgba(211, 47, 47, 0.08)',
          transition: 'background-color 0.3s',
        }}
      >
        <ListItemButton onClick={() => setOpenBalance(!openBalance)}>
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Saldo
              </Typography>
            }
            secondary={`Q ${balance?.toLocaleString()}`}
          />
          {openBalance ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openBalance} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {cat_rubro.map((rubro) => {
              const rubroBalance = rubroBalances[rubro.value] || 0;
              if (rubroBalance !== 0) {
                return (
                  <ListItemButton key={rubro.value} sx={{ pl: 4 }}>
                    <ListItemText
                      primary={rubro.label}
                      secondary={`Q ${rubroBalance.toLocaleString()}`}
                    />
                  </ListItemButton>
                );
              }
              return null;
            })}
          </List>
        </Collapse>
      </Paper>

      <NewBudgetDialog
        open={openNewBudgetDialog}
        onClose={() => setOpenNewBudgetDialog(false)}
        onConfirm={handleConfirmNewBudget}
        rubroBalances={Object.fromEntries(
          Object.entries(rubroBalances).map(([key, value]) => [
            cat_rubro.find((rubro) => rubro.value === key)?.label || key,
            value,
          ])
        )}
      />

      <ItemDialog
        open={openNewItemDialog}
        onClose={() => setOpenNewItemDialog(false)}
        onSave={handleSaveNewItem}
        item={editingItem}
        isEditing={!!editingItem}
        cat_rubro={cat_rubro}
      />
    </Box>
  );
};

export default BudgetContent;
