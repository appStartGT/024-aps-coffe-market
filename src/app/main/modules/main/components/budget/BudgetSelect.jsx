import React, { useState, useEffect } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getBudgetAction } from '../../../../../store/modules/budget';

const BudgetSelect = () => {
  const budgets = useSelector((state) => state.budget.budgets);
  const currentBudget = useSelector((state) => state.budget.budget);
  const dispatch = useDispatch();
  const [selectedBudget, setSelectedBudget] = useState('');

  useEffect(() => {
    if (currentBudget) {
      setSelectedBudget(currentBudget.id_budget);
    }
  }, [currentBudget]);

  const handleBudgetChange = (event) => {
    const id_budget = event.target.value;
    setSelectedBudget(id_budget);
    dispatch(getBudgetAction({ id_budget }));
  };

  return (
    <Box display="flex" alignItems="center">
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
