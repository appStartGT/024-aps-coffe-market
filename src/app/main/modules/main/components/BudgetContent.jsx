import React, { useState } from 'react';
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
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
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
            El balance actual de Q {previousBalance.toLocaleString()} será
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
const ItemDialog = ({
  open,
  onClose,
  onSave,
  item,
  setItem,
  rubros,
  isEditing,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      {isEditing ? 'Editar Item' : 'Agregar Nuevo Item al Presupuesto'}
    </DialogTitle>
    <DialogContent>
      <TextField
        select
        fullWidth
        margin="dense"
        label="Rubro"
        value={item.rubro}
        onChange={(e) => setItem({ ...item, rubro: e.target.value })}
      >
        {rubros.map((rubro) => (
          <MenuItem key={rubro.id} value={rubro.name}>
            {rubro.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        margin="dense"
        label="Monto"
        type="number"
        value={item.amount}
        onChange={(e) => setItem({ ...item, amount: Number(e.target.value) })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onSave} variant="contained">
        {isEditing ? 'Actualizar' : 'Guardar'}
      </Button>
    </DialogActions>
  </Dialog>
);

// Budget List Item Component
const BudgetListItem = ({ item, onEdit, onDelete }) => (
  <ListItemButton sx={{ pl: 4 }}>
    <ListItemText
      primary={item.rubro}
      secondary={`Q ${item.amount.toLocaleString()}`}
    />
    <ListItemSecondaryAction>
      <IconButton
        edge="end"
        aria-label="edit"
        onClick={() => onEdit(item)}
        sx={{ mr: 1 }}
      >
        <EditIcon color="primary" />
      </IconButton>
      <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item)}>
        <DeleteIcon color="error" />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItemButton>
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
            Agregar Rubro
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
          />
        ))}
      </List>
    </Collapse>
  </Paper>
);

// Main Budget Content Component
const BudgetContent = () => {
  const dispatch = useDispatch();
  const [openBudget, setOpenBudget] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  const [previousBalance, setPreviousBalance] = useState(0);
  const auth = useAuth();
  // Get budget data from Redux store
  const budget = useSelector((state) => state.budget.budget);
  const budget_items = useSelector((state) => state.budget.budget_items);
  const expense_items = useSelector((state) => state.budget.expense_items);
  // // Replace mock data with Redux data
  // useEffect(() => {
  //   dispatch(getBudgetAction());
  // }, [dispatch]);

  // Mock data - replace with your actual data
  const rubros = [
    { id: 1, name: 'Materia Prima' },
    { id: 2, name: 'Mano de Obra' },
    { id: 3, name: 'Gastos Operativos' },
  ];

  const [newItem, setNewItem] = useState({
    rubro: '',
    amount: '',
  });

  const handleNewItem = () => {
    setEditingItem(null);
    setNewItem({ rubro: '', amount: '' });
    setOpenNewItemDialog(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({ rubro: item.rubro, amount: item.amount });
    setOpenNewItemDialog(true);
  };

  const handleDeleteItem = (itemToDelete, isBudget) => {
    dispatch(
      deleteBudgetItemAction({
        id_budget_item: itemToDelete.id_budget_item,
        isBudget,
      })
    ).catch((error) => {
      console.error('Error deleting budget item:', error);
    });
  };

  const handleSaveNewItem = () => {
    const newItemWithId = {
      id_budget: budget?.id_budget,
      ...newItem,
    };

    if (editingItem) {
      dispatch(
        updateBudgetItemAction({
          ...newItemWithId,
          id_budget_item: editingItem.id,
        })
      )
        .then(() => {
          setOpenNewItemDialog(false);
          setNewItem({ rubro: '', amount: '' });
          setEditingItem(null);
        })
        .catch((error) => {
          console.error('Error updating budget item:', error);
        });
    } else {
      dispatch(addBudgetItemAction(newItemWithId))
        .then(() => {
          setOpenNewItemDialog(false);
          setNewItem({ rubro: '', amount: '' });
        })
        .catch((error) => {
          console.error('Error adding budget item:', error);
        });
    }
  };

  const calculateTotal = (items) => {
    return items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const budgetTotal = calculateTotal(budget_items || []);
  const expenseTotal = calculateTotal(expense_items || []);
  const balance = budgetTotal - expenseTotal;

  const handleNewBudget = () => {
    const currentBalance = budgetTotal - expenseTotal;
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
        console.error('Error creating new budget:', error);
      });
  };

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
      />

      <CollapsibleSection
        title="Egresos"
        total={expenseTotal}
        isOpen={openExpense}
        onToggle={() => setOpenExpense(!openExpense)}
        items={expense_items || []}
        onEdit={handleEditItem}
        onDelete={(item) => handleDeleteItem(item, false)}
        showAddButton={false}
        backgroundColor="rgba(211, 47, 47, 0.08)"
        id_budget={budget?.id_budget}
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
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Balance: Q {balance.toLocaleString()}
        </Typography>
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
        item={newItem}
        setItem={setNewItem}
        rubros={rubros}
        isEditing={!!editingItem}
      />
    </Box>
  );
};

export default BudgetContent;
