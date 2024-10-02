import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { productsListAction } from '../../../../store/modules/products';

const AutocompleteProduct = ({
  setList = [],
  list = [],
  // open,
  // setOpen,
  id_organization,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.sales.processing);
  const productList = useSelector((state) => state.products.tabProductosList);
  const [valueSearch, setValueSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [isBarcodeScannerInput, setIsBarcodeScannerInput] = useState(false);

  useEffect(() => {
    dispatch(productsListAction({ id_organization }));
  }, []);

  function filtrarProductosEnFactura(productList, list) {
    if (list.length === 0) {
      return productList.map((producto) => ({
        ...producto,
        label: producto.name,
      }));
    }

    return productList
      .filter((producto) => {
        return !list.some(
          (facturaProducto) =>
            facturaProducto.id_product === producto.id_product
        );
      })
      .map((producto) => ({
        ...producto,
        label: producto.name,
      }));
  }
  // Handle option selection
  const handleOptionSelect = (selectedOption) => {
    setList([...list, selectedOption]);
  };

  useEffect(() => {
    //ignore barcode scanner directly into the field the reading must do by useScanDetection
    const handleKeyPress = (event) => {
      const currentTime = new Date().getTime();
      const timeSinceLastKeyPress = currentTime - lastKeyPressTime;
      const key = event.key;

      // If keypress events are too close together, it's likely a barcode scanner input
      if (timeSinceLastKeyPress < 20 && key !== 'Enter' && key !== 'Tab') {
        setIsBarcodeScannerInput(true);
      } else {
        setIsBarcodeScannerInput(false);
      }

      // Update the last keypress time
      lastKeyPressTime = currentTime;
    };

    let lastKeyPressTime = new Date().getTime();
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      inputValue={valueSearch}
      onInputChange={(event, newInputValue) => {
        if (isBarcodeScannerInput) return; //we don't use the scanner directly
        if (event && event.type === 'change') {
          setValueSearch(newInputValue);
        }
        if (event && event.type === 'click') {
          setValueSearch('');
          /*  dispatch(clearproductsList()); */
        }
      }}
      options={filtrarProductosEnFactura(productList, list)}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          label="Buscar producto"
          variant="outlined"
        />
      )}
      noOptionsText="Ingrese un nombre de producto existente"
      isOptionEqualToValue={(option, value) => option?.value == value?.value}
      getOptionDisabled={(option) => option?.quantity == 0}
      onChange={(_, selectedOption) => {
        if (selectedOption) {
          handleOptionSelect({ ...selectedOption, units: 1 });
        }
      }}
    />
  );
};

export default AutocompleteProduct;
