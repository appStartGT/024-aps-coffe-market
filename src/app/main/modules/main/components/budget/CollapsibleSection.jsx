import React from 'react';
import {
  Paper,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  Box,
  Button,
  List,
} from '@mui/material';
import { ExpandLess, ExpandMore, Add as AddIcon } from '@mui/icons-material';
import BudgetListItem from './BudgetListItem';

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
  hideButtons,
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
            hideButtons={hideButtons}
          />
        ))}
      </List>
    </Collapse>
  </Paper>
);

export default CollapsibleSection;
