import React, { useState } from 'react';
import {
  List,
  ListItemText,
  Checkbox,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  ListItemButton,
  Paper,
  Box,
} from '@mui/material';
import SearchBar from '@components/SearchBar';
import { useUpdateEffect } from '@hooks';
import ProductImageViewer from './ProducImageViewer';

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/100';

const ProductList = ({
  items = [],
  propsSearchBarButton,
  checkedItems,
  setCheckedItems,
  quantityInputs,
  setQuantityInputs,
}) => {
  const [open, setOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState('');
  const [errors, setErrors] = useState({});
  const [activeInput, setActiveInput] = useState(null);

  /* Update selected textfield according  quantityInputs*/
  useUpdateEffect(() => {
    if (Object.keys(quantityInputs).length == checkedItems.length) return;
    setCheckedItems(
      checkedItems.filter((item) =>
        Object.keys(quantityInputs).includes(item.name)
      )
    );
  }, [quantityInputs]);

  const handleToggle = (item) => () => {
    if (item.quantity <= 0) return;
    const currentIndex = checkedItems.findIndex(
      (checkedItem) => checkedItem.name === item.name
    );
    const newChecked = [...checkedItems];
    const newQuantityInputs = { ...quantityInputs };

    if (errors[item.name]) {
      const newErrors = { ...errors };
      delete newErrors[item.name];
      setErrors(newErrors);
    }

    if (currentIndex === -1) {
      newChecked.push({ ...item, quantity: 1 }); // Include quantity in the item object
      newQuantityInputs[item.name] = 1;
    } else {
      newChecked.splice(currentIndex, 1);
      delete newQuantityInputs[item.name];
    }

    setCheckedItems(newChecked);
    setQuantityInputs(newQuantityInputs);
  };

  const handleQuantityChange = (item) => (event) => {
    const value = parseInt(event.target.value, 10);
    if (value < 0) return;

    // Validate input
    if (value > item.quantity) {
      setErrors({
        ...errors,
        [item.name]: `Cantidad no puede exceder ${item.quantity}`,
      });
      return;
    }

    const newQuantityInputs = { ...quantityInputs, [item.name]: value };
    setQuantityInputs(newQuantityInputs);

    const newChecked = checkedItems.map((checkedItem) =>
      checkedItem.name === item.name
        ? { ...checkedItem, quantity: value }
        : checkedItem
    );
    setCheckedItems(newChecked);

    const newErrors = { ...errors };
    delete newErrors[item.name];
    setErrors(newErrors);
  };

  const handleQuantityBlur = (item) => () => {
    const value = quantityInputs[item.name];
    if (!value || value <= 0) {
      setCheckedItems(
        checkedItems.filter((checkedItem) => checkedItem.name !== item.name)
      );
      const newQuantityInputs = { ...quantityInputs };
      delete newQuantityInputs[item.name];
      setQuantityInputs(newQuantityInputs);
    }
  };

  const handleTextFieldFocus = (item) => () => {
    if (activeInput && activeInput !== item.name) {
      const value = quantityInputs[activeInput];
      if (!value || value <= 0) {
        setCheckedItems(
          checkedItems.filter((checkedItem) => checkedItem.name !== activeInput)
        );
        const newQuantityInputs = { ...quantityInputs };
        delete newQuantityInputs[activeInput];
        setQuantityInputs(newQuantityInputs);
      }
    }
    setActiveInput(item.name);
  };

  const handleClickOpen = (photo, event) => {
    event.stopPropagation();
    setCurrentImg(photo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper
      sx={{
        padding: '20px',
        borderRadius: '16px',
        maxHeight: '90vh',
        overflow: 'auto',
        paddingTop: '0px',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      elevation={0}
    >
      <Box
        position={'sticky'}
        top={0}
        bgcolor={'white'}
        borderRadius={'12px'}
        zIndex={999}
        paddingTop={'20px'}
      >
        <Typography mb={'12px'}>Productos</Typography>
        <SearchBar {...propsSearchBarButton} />
      </Box>
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.name}
            disableTouchRipple={
              checkedItems.findIndex(
                (checkedItem) => checkedItem.name === item.name
              ) !== -1
            }
            // onClick={handleToggle(item)}
          >
            <ListItemAvatar
              onClick={(event) =>
                handleClickOpen(item.photo || DEFAULT_IMAGE_URL, event)
              }
            >
              <Avatar alt={item.name} src={item.photo || DEFAULT_IMAGE_URL} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`Precio: ${item.sale_price}, Disponibles: ${item.quantity}`}
              onClick={handleToggle(item)}
            />
            <Checkbox
              edge="end"
              checked={
                checkedItems.findIndex(
                  (checkedItem) => checkedItem.name === item.name
                ) !== -1
              }
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': item.name }}
              onClick={handleToggle(item)}
            />
            {checkedItems.findIndex(
              (checkedItem) => checkedItem.name === item.name
            ) !== -1 && (
              <div>
                <TextField
                  label="Cantidad"
                  type="number"
                  value={quantityInputs[item.name] || ''}
                  onChange={handleQuantityChange(item)}
                  onBlur={handleQuantityBlur(item)}
                  onFocus={handleTextFieldFocus(item)}
                  style={{ marginLeft: '16px', maxWidth: '150px' }}
                  error={!!errors[item.name]}
                  helperText={errors[item.name] || ''}
                />
              </div>
            )}
          </ListItemButton>
        ))}
      </List>
      {/* Image viewver */}
      <ProductImageViewer
        src={currentImg}
        open={open}
        handleClose={handleClose}
      />
    </Paper>
  );
};

export default ProductList;
