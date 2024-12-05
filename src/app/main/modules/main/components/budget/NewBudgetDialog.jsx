import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';

const NewBudgetDialog = ({ open, onClose, onConfirm, rubroBalances }) => {
  const [errors, setErrors] = useState({});
  const processing = useSelector((state) => state.budget.processing);

  const validateRubroBalances = () => {
    const newErrors = {};
    Object.entries(rubroBalances).forEach(([key, value]) => {
      if (value <= 0) {
        newErrors[key] = 'El saldo debe ser mayor que 0';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateRubroBalances()) {
      onConfirm(rubroBalances);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Nuevo Presupuesto</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Alert severity="warning">
            ¿Está seguro que desea crear un nuevo presupuesto? Esta acción
            reiniciará todos los valores.
          </Alert>
          <Alert severity="info">
            El nuevo presupuesto se creará con los valores actuales de cada
            rubro.
          </Alert>
          {Object.entries(rubroBalances).map(([key, value]) => (
            <TextField
              key={key}
              label={key}
              type="number"
              value={Number(value).toFixed(2)}
              error={!!errors[key]}
              helperText={errors[key]}
              InputProps={{
                readOnly: true,
              }}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={processing}
        >
          Crear Nuevo Presupuesto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewBudgetDialog;
