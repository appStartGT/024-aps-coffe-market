import React, { useState } from 'react';
import {
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

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
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                Q {item.amount.toLocaleString()}
              </Typography>
              {item.description && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {' - '}
                  {item.description}
                </Typography>
              )}
            </>
          }
        />
        <ListItemSecondaryAction>
          {!item.isInitial && (
            <>
              <Tooltip title="Editar">
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(item)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleDeleteClick}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
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

export default BudgetListItem;
