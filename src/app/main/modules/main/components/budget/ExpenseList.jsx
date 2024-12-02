import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';

const ExpenseList = ({ expenses, renderPrimaryText = true }) => {
  console.log('expenses', expenses);
  return (
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
};

export default ExpenseList;
