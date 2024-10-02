import React, { Fragment, useState } from 'react';
import { Autocomplete, Grid, TextField } from '@mui/material';

const ApsAutoComplete = ({
  options = [],
  gridItem = false,
  gridProps = {},
  onAddNew,
  name,
  formik,
  label,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const filterOptions = (newOptions, params) => {
    // Si options está inicialmente vacío, añade directamente la opción de agregar nuevo
    if (options.length === 0 && onAddNew) {
      return [
        {
          inputValue: params.inputValue,
          label: `Agregar`,
          isNew: true,
        },
      ];
    }

    // Filtra las opciones según el input del usuario
    const filtered = options.filter((option) =>
      option.label?.toLowerCase()?.includes(params.inputValue.toLowerCase())
    );

    // Si no hay coincidencias después del filtrado, y hay algo en el inputValue, añade la opción de agregar nuevo
    if (filtered.length === 0 && params.inputValue !== '' && onAddNew) {
      filtered.push({
        inputValue: params.inputValue,
        label: `Agregar "${params.inputValue}"`,
        isNew: true,
      });
    }
    return filtered;
  };

  const handleChange = (event, newValue) => {
    if (newValue && newValue.isNew) {
      onAddNew(newValue.inputValue);
      setInputValue('');
    } else {
      formik.setFieldValue(name, newValue);
      setInputValue(newValue ? newValue.label : '');
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const Container = gridItem ? Grid : Fragment;
  const propsGrid = gridItem
    ? { item: true, md: 6, sm: 12, xs: 12, ...gridProps }
    : {};

  // Configuración de Formik para el componente de entrada
  const _formikConfig = () => ({
    value: formik.values[name],
    onChange: handleChange,
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
  });

  return (
    <Container {...propsGrid}>
      <Autocomplete
        options={options}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        getOptionLabel={(option) => option.label || ''}
        filterOptions={filterOptions}
        onChange={handleChange}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        clearOnEscape
        fullWidth
        value={formik.values[name]}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            onClick={handleOpen}
            error={Boolean(formik.errors[name])}
            helperText={formik.errors[name]}
          />
        )}
        {...props}
        {..._formikConfig}
      />
    </Container>
  );
};

export default ApsAutoComplete;
