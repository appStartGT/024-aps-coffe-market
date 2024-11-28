import React, { useState } from 'react';
import {
  Paper,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ExpenseList from './ExpenseList';

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

export default Egresos;
