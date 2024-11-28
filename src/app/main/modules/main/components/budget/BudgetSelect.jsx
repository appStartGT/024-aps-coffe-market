import React, { useState, useEffect } from 'react';
import { Box, MenuItem, TextField, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBudgetAction,
  setSelectedBudgetAction,
} from '../../../../../store/modules/budget';
import { purchaseListAction } from '../../../../../store/modules/purchase';
import { getExpenseListAction } from '../../../../../store/modules/expense';

const BudgetSelect = () => {
  const budgets = useSelector((state) => state.budget.budgets);
  const currentBudget = useSelector((state) => state.budget.budget);
  const dispatch = useDispatch();
  const [selectedBudget, setSelectedBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentBudget) {
      setSelectedBudget(currentBudget.id_budget);
    }
  }, [currentBudget]);

  const handleBudgetChange = (event) => {
    const id_budget = event.target.value;
    setSelectedBudget(id_budget);
    setIsLoading(true);
    Promise.all([
      dispatch(getBudgetAction({ id_budget })).unwrap(),
      dispatch(purchaseListAction({ id_budget, force: true })).unwrap(), //get from database
      dispatch(getExpenseListAction({ id_budget, force: true })).unwrap(), //get from database
    ]).finally(() => setIsLoading(false));
    dispatch(setSelectedBudgetAction(id_budget));
  };

  return (
    <Box display="flex" alignItems="center">
      {isLoading && <CircularProgress size={24} sx={{ mr: 1 }} />}

      <TextField
        select
        value={selectedBudget}
        onChange={handleBudgetChange}
        size="small"
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '12px',
        }}
        placeholder="Select Budget"
      >
        <MenuItem value="" disabled>
          Seleccionar presupuesto
        </MenuItem>
        {budgets.map((budget) => (
          <MenuItem key={budget.value} value={budget.value}>
            {budget.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default BudgetSelect;
