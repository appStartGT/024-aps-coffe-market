import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';

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

export default ItemDialog;
