import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

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

export default DeleteConfirmationDialog;
