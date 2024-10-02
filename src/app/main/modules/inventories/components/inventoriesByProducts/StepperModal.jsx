import React, { useState } from 'react';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  Avatar,
  Grid,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { productsListAction } from '../../../../../store/modules/products';
import { useAuth, useMountEffect } from '@hooks';
import { Person as PersonIcon, RecentActors } from '@mui/icons-material';
import ImageViewer from '@components/ImageViewer';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';

import {
  inventoryBranchCreateAction,
  inventoryBranchListAction,
} from '../../../../../store/modules/productInventory';

const today = new Date().toISOString().split('T')[0];

const validationSchema = yup.object({
  percent: yup
    .number()
    .min(0, 'El porcentaje no puede ser menor que 0')
    .max(100, 'El porcentaje no puede ser mayor que 100')
    .typeError('Debe ser un número'),
  sale_price: yup
    .number()
    .typeError('Cantidad ingresada no válida')
    .positive('La cantidad debe ser un número positivo')
    .required('Por favor ingrese el precio'),
  expireAt: yup
    .date()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .min(today, 'La fecha no puede ser anterior a hoy'),
  quantity: yup
    .number()
    .required('Por favor ingrese la cantidad')
    .typeError('Cantidad ingresada no válida'),
});

const ProductModal = ({ setOpenStepper }) => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openViewer, setOpenViewer] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [errors, setErrors] = useState({}); // Estado inicial de errores
  const productInventory = useSelector(
    (state) => state.products.tabProductosList
  );

  const inventory = useSelector(
    (state) => state.productInventory.productInventoryList
  );
  const processing = useSelector((state) => state.productInventory.processing);
  const { id_branch, id_inventory } = useParams();

  useMountEffect({
    effect: () => {
      let params = { isCombo: false };
      auth.user.id_organization &&
        (params.id_organization = auth.user.id_organization);
      dispatch(productsListAction(params));
    },
  });

  useMountEffect({
    effect: () => {
      let params = {
        id_inventory,
      };
      dispatch(inventoryBranchListAction(params));
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleToggle = (productId) => {
    const currentIndex = selectedProducts.findIndex((p) => p.id === productId);
    const newSelectedProducts = [...selectedProducts];

    if (currentIndex === -1) {
      const selectedProduct = productInventory.find((p) => p.id === productId);
      newSelectedProducts.push({
        ...selectedProduct,
        percent: 0,
        sale_price: '',
        expireAt: '',
        quantity: '',
        description: '',
        mayor_sale_price: '',
      });
    } else {
      newSelectedProducts.splice(currentIndex, 1);
    }

    setSelectedProducts(newSelectedProducts);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = productInventory.filter((product) => {
    const name = product.name.toLowerCase();
    const barcode = product.barcode ? product.barcode.toLowerCase() : '';
    const searchTermLower = searchTerm.toLowerCase();

    // Generamos un arreglo de IDs de producto desde inventory para la comparación
    const inventoryIds = inventory.map((item) => item.id_product);

    return (
      !inventoryIds.includes(product.id) &&
      (name.includes(searchTermLower) || barcode.includes(searchTermLower))
    );
  });
  const handleImageClick = (image) => {
    setCurrentImage(image);
    setOpenViewer(true);
  };

  const steps = ['Selecciona productos', 'Detalles del producto'];

  const validateField = (productId, fieldName, value) => {
    const product = selectedProducts.find((p) => p.id === productId);
    const productToValidate = { ...product, [fieldName]: value };

    validationSchema
      .validateAt(fieldName, productToValidate)
      .then(() => {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          if (newErrors[productId]) {
            delete newErrors[productId][fieldName];
            if (Object.keys(newErrors[productId]).length === 0) {
              delete newErrors[productId];
            }
          }
          return newErrors;
        });
      })
      .catch((err) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [productId]: { ...prevErrors[productId], [fieldName]: err.message },
        }));
      });
  };

  const handleFieldChange = (e, productId, fieldName) => {
    const { value } = e.target;
    const updatedProducts = selectedProducts.map((product) => {
      if (product.id === productId) {
        const updatedProduct = { ...product, [fieldName]: value };
        if (fieldName === 'percent') {
          const cost = updatedProduct.unit_price
            ? updatedProduct.unit_price
            : 0;
          const price = Number(cost) * (1 + Number(value) / 100);
          updatedProduct.sale_price = price.toFixed(2);
        }
        return updatedProduct;
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
    validateField(productId, fieldName, value);
  };

  const handleSave = async () => {
    let isValid = true;
    const newErrors = {};

    for (const product of selectedProducts) {
      try {
        await validationSchema.validate(product, { abortEarly: false });
      } catch (validationErrors) {
        isValid = false;
        validationErrors.inner.forEach((error) => {
          if (!newErrors[product.id]) {
            newErrors[product.id] = {};
          }
          newErrors[product.id][error.path] = error.message;
        });
      }
    }

    if (isValid) {
      const orders = selectedProducts.map((product) => ({
        quantity: product.quantity,
        unit_price: product.unit_price,
        id_product: product.id_product,
        id_organization: product.id_organization,
        id_branch: id_branch,
        id_inventory: id_inventory,
        mayor_sale_price: product.mayor_sale_price || 0,
        tipo: 'AÑADIR',
      }));

      const inventoryProduct = selectedProducts.map((product) => ({
        id_branch: id_branch,
        id_inventory: id_inventory,
        percent: product.percent || 0,
        sale_price: product.sale_price,
        expireAt: product.expireAt || null,
        quantity: product.quantity,
        description: product.description || '',
        id_organization: auth.user.id_organization,
        id_product: product.id_product,
        mayor_sale_price: product.mayor_sale_price || 0,
        isCombo: false,
      }));
      const dataEnviar = {
        inventory: inventoryProduct,
        orders,
      };

      dispatch(inventoryBranchCreateAction(dataEnviar)).then(() => {
        setOpenStepper(false);
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      {openViewer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <ImageViewer
            open={openViewer}
            onClose={() => {
              setOpenViewer(false);
              setCurrentImage(null);
            }}
            images={[
              {
                src: currentImage,
                alt: 'Product image',
              },
            ]}
          />
        </div>
      )}

      <Container maxWidth="md">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={4}>
          {activeStep === 0 && (
            <Box>
              <TextField
                label="Buscar producto"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Box mt={2} maxHeight={400} overflow="auto">
                {processing && !filteredProducts.length ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      justifyItems: 'center',
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <List
                    dense
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                  >
                    {filteredProducts.map((product) => {
                      const labelId = `checkbox-list-secondary-label-${product.id}`;
                      return (
                        <ListItem
                          key={product.id}
                          secondaryAction={
                            <Checkbox
                              edge="end"
                              onChange={() => handleToggle(product.id)}
                              checked={selectedProducts.some(
                                (p) => p.id === product.id
                              )}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton
                            onClick={() => handleToggle(product.id)}
                            sx={{ cursor: 'pointer' }} // Asegura que el cursor sea un puntero en todo el botón
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  cursor: 'pointer', // Esto hace que el cursor cambie a pointer sobre el avatar
                                  marginBottom: {
                                    xs: '8px !important',
                                    md: '12px !important',
                                  },
                                }}
                                color={'secondary'}
                                src={product?.photo}
                                onClick={() => handleImageClick(product?.photo)} // Maneja el evento de clic en el avatar
                              >
                                <PersonIcon
                                  color={'primary'}
                                  fontSize="large"
                                />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={product.name} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Box>
              <div
                style={{
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: '#fff',
                  padding: '10px',
                  zIndex: 1,
                }}
              >
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!selectedProducts.length}
                >
                  Siguiente
                </Button>
              </div>
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              {selectedProducts.map((product) => (
                <Paper key={product.id} sx={{ p: 2, mb: 2 }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    <Avatar
                      sx={{
                        marginBottom: {
                          xs: '8px !important',
                          md: '12px !important',
                        },
                        cursor: 'pointer', // Mueve 'cursor' fuera de marginBottom para que sea parte del estilo
                        width: '100px', // Establece el ancho en 100px
                        height: '100px', // Establece la altura en 100px
                      }}
                      color={'secondary'}
                      src={product?.photo}
                      onClick={() => {
                        if (product?.photo) {
                          setCurrentImage(product?.photo);
                          setOpenViewer(true);
                        }
                      }}
                    >
                      <PersonIcon color={'primary'} fontSize="large" />
                    </Avatar>
                    <Typography
                      variant="h6"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      {' '}
                      {`Q.${product.unit_price} - ${product.name}`}{' '}
                    </Typography>
                    {openViewer && currentImage === product?.photo && (
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        <ImageViewer
                          open={openViewer}
                          onClose={() => {
                            setOpenViewer(false);
                            setCurrentImage(null);
                          }}
                          images={[{ src: currentImage, alt: 'Product image' }]}
                        />
                      </div>
                    )}
                  </div>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Porcentaje"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.percent || ''}
                        onChange={(e) =>
                          handleFieldChange(e, product.id, 'percent')
                        }
                        error={!!errors[product.id]?.percent}
                        helperText={errors[product.id]?.percent}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <RecentActors />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Precio venta"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.sale_price || ''}
                        onChange={(e) =>
                          handleFieldChange(e, product.id, 'sale_price')
                        }
                        error={!!errors[product.id]?.sale_price}
                        helperText={errors[product.id]?.sale_price}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <RecentActors />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Precio mayorista"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.mayor_sale_price || ''}
                        onChange={(e) =>
                          handleFieldChange(e, product.id, 'mayor_sale_price')
                        }
                        error={!!errors[product.id]?.mayor_sale_price}
                        helperText={errors[product.id]?.mayor_sale_price}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <RecentActors />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Fecha de vencimiento"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={product.expireAt || ''}
                        onChange={(e) =>
                          handleFieldChange(e, product.id, 'expireAt')
                        }
                        error={!!errors[product.id]?.expireAt}
                        helperText={errors[product.id]?.expireAt}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Cantidad"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.quantity || ''}
                        onChange={(e) =>
                          handleFieldChange(e, product.id, 'quantity')
                        }
                        error={!!errors[product.id]?.quantity}
                        helperText={errors[product.id]?.quantity}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <RecentActors />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <div
                style={{
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: '#fff',
                  padding: '10px',
                  zIndex: 1,
                }}
              >
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={processing || !selectedProducts.length}
                >
                  Guardar
                </Button>
              </div>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ProductModal;
