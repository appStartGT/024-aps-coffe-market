import React, { useEffect, useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Box,
  IconButton,
  Paper,
  Button,
  Stack,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import {
  createBudgetAction,
  addBudgetItemAction,
  deleteBudgetItemAction,
  updateBudgetItemAction,
} from '../../../../store/modules/budget';
import { useAuth } from '@hooks';
import { catRubroCatalogAction } from '../../../../store/modules/catalogs';

// New Budget Dialog Component
const NewBudgetDialog = ({ open, onClose, onConfirm, previousBalance }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Crear Nuevo Presupuesto</DialogTitle>
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <Alert severity="warning">
          ¿Está seguro que desea crear un nuevo presupuesto? Esta acción
          reiniciará todos los valores.
        </Alert>
        {previousBalance > 0 && (
          <Alert severity="info">
            El saldo actual de Q {previousBalance.toLocaleString()} será
            agregado como saldo inicial en el nuevo presupuesto.
          </Alert>
        )}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} variant="contained" color="primary">
        Crear Nuevo Presupuesto
      </Button>
    </DialogActions>
  </Dialog>
);

// Add/Edit Item Dialog Component
const ItemDialog = ({ open, onClose, onSave, item, isEditing, cat_rubro }) => {
  const [formValues, setFormValues] = useState({
    id_cat_rubro: '',
    amount: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormValues({
        id_cat_rubro: item.id_cat_rubro,
        amount: item.amount,
      });
    } else {
      setFormValues({
        id_cat_rubro: '',
        amount: '',
      });
    }
    setErrors({});
  }, [item]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.id_cat_rubro) {
      newErrors.id_cat_rubro = 'Por favor seleccione una categoría';
    }
    if (
      !formValues.amount ||
      isNaN(formValues.amount) ||
      Number(formValues.amount) <= 0
    ) {
      newErrors.amount = 'Por favor ingrese un monto válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formValues,
        amount: Number(formValues.amount),
      });
      setFormValues({
        id_cat_rubro: '',
        amount: '',
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditing ? 'Editar Ítem' : 'Agregar Nuevo Ítem al Presupuesto'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Categoría"
            name="id_cat_rubro"
            value={formValues.id_cat_rubro}
            onChange={handleChange}
            fullWidth
            error={!!errors.id_cat_rubro}
            helperText={errors.id_cat_rubro}
          >
            {cat_rubro.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Monto"
            name="amount"
            type="number"
            value={formValues.amount}
            onChange={handleChange}
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, itemName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmar Eliminación</DialogTitle>
    <DialogContent>
      <Typography>
        ¿Está seguro que desea eliminar este ítem del presupuesto: {itemName}?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Eliminar
      </Button>
    </DialogActions>
  </Dialog>
);

// Budget List Item Component
const BudgetListItem = ({ item, onEdit, onDelete, cat_rubro }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const rubroLabel = item.isInitial
    ? 'Saldo inicial'
    : cat_rubro.find((rubro) => rubro.value === item.id_cat_rubro)?.label ||
      'Desconocido';

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(item);
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <ListItemButton sx={{ pl: 4 }}>
        <ListItemText
          primary={rubroLabel}
          secondary={`Q ${item.amount.toLocaleString()}`}
        />
        <ListItemSecondaryAction>
          {!item.isInitial && (
            <>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEdit(item)}
                sx={{ mr: 1 }}
              >
                <EditIcon color="primary" />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={handleDeleteClick}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}
        </ListItemSecondaryAction>
      </ListItemButton>
      {!item.isInitial && (
        <DeleteConfirmationDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          itemName={rubroLabel}
        />
      )}
    </>
  );
};

// Expense List Component
const ExpenseList = ({ expenses, renderPrimaryText = true }) => (
  <List component="div" disablePadding>
    {Object.entries(expenses).map(([key, value]) => (
      <ListItemButton key={key} sx={{ pl: 4 }}>
        <ListItemText
          primary={renderPrimaryText ? key : ''}
          secondary={`Q ${value.total.toLocaleString()}`}
        />
      </ListItemButton>
    ))}
  </List>
);

// Collapsible Section Component
const CollapsibleSection = ({
  title,
  total,
  isOpen,
  onToggle,
  items,
  onEdit,
  onDelete,
  showAddButton,
  onAdd,
  backgroundColor,
  id_budget,
  cat_rubro,
}) => (
  <Paper
    elevation={2}
    sx={{
      mb: 2,
      backgroundColor,
      transition: 'background-color 0.3s',
      '&:hover': {
        backgroundColor: backgroundColor.replace('0.08', '0.12'),
      },
    }}
  >
    <ListItemButton onClick={onToggle}>
      <ListItemText
        primary={<Typography variant="h6">{title}</Typography>}
        secondary={`Q ${total?.toLocaleString()}`}
      />
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      {showAddButton && id_budget && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'start' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{ mb: 1 }}
          >
            Agregar Categoría
          </Button>
        </Box>
      )}
      <List component="div" disablePadding>
        {items?.map((item) => (
          <BudgetListItem
            key={item.id_budget_item}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            cat_rubro={cat_rubro}
          />
        ))}
      </List>
    </Collapse>
  </Paper>
);

// Egresos Component
const Egresos = ({
  expenseTotal,
  expense_purchaseDetails,
  expense_expenses,
  expense_loans,
}) => {
  const [openExpense, setOpenExpense] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
        transition: 'background-color 0.3s',
      }}
    >
      <ListItemButton onClick={() => setOpenExpense(!openExpense)}>
        <ListItemText
          primary={<Typography variant="h6">Egresos</Typography>}
          secondary={`Q ${expenseTotal?.toLocaleString()}`}
        />
        {openExpense ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openExpense} timeout="auto" unmountOnExit>
        <Typography sx={{ fontWeight: 'bold', pl: 2, pt: 1, fontSize: '12px' }}>
          Compras
        </Typography>
        <ExpenseList expenses={expense_purchaseDetails} />
        <Typography sx={{ fontWeight: 'bold', pl: 2, pt: 1, fontSize: '12px' }}>
          Gastos Operativos
        </Typography>
        <ExpenseList expenses={expense_expenses} />
        <Typography sx={{ fontWeight: 'bold', pl: 2, pt: 1, fontSize: '12px' }}>
          Préstamos
        </Typography>
        <ExpenseList expenses={expense_loans} renderPrimaryText={false} />
      </Collapse>
    </Paper>
  );
};

// Main Budget Content Component
const BudgetContent = () => {
  const dispatch = useDispatch();
  const [openBudget, setOpenBudget] = useState(false);
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  const [previousBalance, setPreviousBalance] = useState(0);
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
          amount: Number(item.price || 0) * Number(item.quantity || 0),
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
    );

  const transferenciasTotal =
    expense_purchaseDetails?.Transferencia?.total || 0;

  const balance = budgetTotal - expenseTotal;

  const handleNewBudget = () => {
    const currentBalance = budgetTotal - expenseTotal - transferenciasTotal;
    setPreviousBalance(currentBalance);
    setOpenNewBudgetDialog(true);
  };

  const handleConfirmNewBudget = () => {
    dispatch(
      createBudgetAction({
        initialBalance: previousBalance,
        createdBy: auth.user?.id_user || '',
      })
    )
      .then(() => {
        setOpenNewBudgetDialog(false);
      })
      .catch((error) => {
        console.error('Error al crear nuevo presupuesto:', error);
      });
  };

  const calculateRubroBalance = () => {
    const rubroBalances = {};

    // Calculate budget amounts for each rubro
    budget_items?.forEach((item) => {
      if (!rubroBalances[item.id_cat_rubro]) {
        rubroBalances[item.id_cat_rubro] = 0;
      }
      rubroBalances[item.id_cat_rubro] += Number(item.amount);
    });

    // Subtract expenses for each rubro
    Object.values(expense_expenses || {}).forEach((group) => {
      group.items.forEach((item) => {
        if (!rubroBalances[item.id_cat_rubro]) {
          rubroBalances[item.id_cat_rubro] = 0;
        }
        rubroBalances[item.id_cat_rubro] -= Number(item.amount || 0);
      });
    });

    // Subtract Transferencias from Bancos
    if (allExpenses?.Transferencia) {
      const bancosRubro = cat_rubro.find(
        (rubro) => rubro.label === 'Bancos'
      )?.value;
      if (bancosRubro && rubroBalances[bancosRubro]) {
        rubroBalances[bancosRubro] -= transferenciasTotal;
      }
    }

    // Subtract the rest of the expenses from Efectivo
    const efectivoRubro = cat_rubro.find(
      (rubro) => rubro.label === 'Efectivo'
    )?.value;
    if (efectivoRubro && rubroBalances[efectivoRubro]) {
      const totalOtherExpenses =
        Object.values(allExpenses).reduce(
          (sum, group) => sum + (group.total || 0),
          0
        ) - transferenciasTotal; // Exclude Transferencias as they're already subtracted from Bancos
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

      <CollapsibleSection
        title="Presupuesto"
        total={budgetTotal}
        isOpen={openBudget}
        onToggle={() => setOpenBudget(!openBudget)}
        items={budget_items || []}
        onEdit={handleEditItem}
        onDelete={(item) => handleDeleteItem(item, true)}
        showAddButton={true}
        onAdd={handleNewItem}
        backgroundColor="rgba(25, 118, 210, 0.08)"
        id_budget={budget?.id_budget}
        cat_rubro={cat_rubro}
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
          p: 2,
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
                Saldo: Q {balance.toLocaleString()}
              </Typography>
            }
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
        previousBalance={previousBalance}
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
