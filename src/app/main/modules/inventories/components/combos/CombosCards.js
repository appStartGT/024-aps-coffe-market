import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { useAuth } from '@hooks';
import { useParams } from 'react-router-dom';
import { Paper, Grid, Card, CardContent, Typography } from '@mui/material';
import { productsListAction } from '../../../../../store/modules/products';
import {
  inventoryBranchCreateOneitemAction,
  inventoryBranchListComboAction,
} from '../../../../../store/modules/productInventory';
import { setApsGlobalModalPropsAction } from '../../../../../store/modules/main';
import ApsListResponsive from '@components/ApsListResponsive';
import { Save } from '@mui/icons-material';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: '#f0f0f0',
};

const stylesCard = (isAvailable) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  opacity: isAvailable ? 1 : 0.5, // Aplica menor opacidad si no está disponible
  cursor: 'pointer', // Mantén el cursor como pointer para todas las cards
  position: 'relative', // Necesario para posicionar el spinner sobre la imagen
});

const stylesImage = {
  width: '100%',
  height: '150px',
  objectFit: 'cover', // Asegura que la imagen se ajuste correctamente
};

const stylesSpinner = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2, // Asegura que el spinner esté por encima de la imagen
};

const CombosCard = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { id_branch, id_inventory } = useParams();

  const productInventory = useSelector(
    (state) => state.products.tabProductosList
  );

  const processing = useSelector((state) => state.products.processing);

  const productInventoryListCombo = useSelector(
    (state) => state.productInventory.productInventoryListCombo
  );
  const processingProductList = useSelector(
    (state) => state.productInventory.processingProductList
  );

  const [availableCombos, setAvailableCombos] = useState([]);

  const checkComboAvailability = (combos, productInventoryListCombo) => {
    if (productInventoryListCombo.length === 0) {
      return combos.map((combo) => ({
        ...combo,
        isAvailable: false,
      }));
    }

    // Filtrar y marcar disponibilidad
    return combos
      .filter(
        (combo) =>
          // Filtrar combos que ya están en el inventario para que no se muestren
          !productInventoryListCombo.some(
            (inventoryItem) => inventoryItem.id_product === combo.id
          )
      )
      .map((combo) => {
        const quantityProduct = combo.comboProducts.map((product) => {
          const inventoryMatch = productInventoryListCombo.find(
            (inventoryItem) => inventoryItem.id_product === product.id_product
          );
          return {
            quantity: product.quantity,
            id_inventory_branch: inventoryMatch
              ? inventoryMatch.id_inventory_branch
              : null,
          };
        });

        const allProductsInInventory = quantityProduct.every(
          (item) => item.id_inventory_branch !== null
        );

        return {
          ...combo,
          isAvailable: allProductsInInventory,
          quantityProduct,
        };
      });
  };

  useEffect(() => {
    if (auth?.user?.id_organization) {
      const params = {
        isCombo: true,
        id_organization: auth.user.id_organization,
      };
      dispatch(productsListAction(params));
      dispatch(inventoryBranchListComboAction({ id_branch, id_inventory }));
    }
  }, []);

  // Calcular la disponibilidad de los combos
  useEffect(() => {
    if (productInventory.length) {
      const combosAvailability = checkComboAvailability(
        productInventory,
        productInventoryListCombo
      );
      setAvailableCombos(combosAvailability);
    }
  }, [productInventory, productInventoryListCombo]);

  // Función para crear las propiedades del modal
  const createModalProps = (combo, isAvailable) => {
    const content = [
      {
        title: 'Combo',
        subtitle: combo.name,
      },
      {
        title: 'Descripción',
        subtitle: combo.description,
      },
    ];

    if (!isAvailable) {
      const missingProducts = combo.comboProducts
        .filter(
          (product) =>
            !productInventoryListCombo.some(
              (inventoryItem) => inventoryItem.id_product === product.id_product
            )
        )
        .map((product) => product.name)
        .join(', ');

      content.push({
        title: 'Productos faltantes',
        subtitle: missingProducts,
        xs: 12,
        sm: 12,
        md: 12,
      });
    }

    return {
      open: true,
      title: 'Detalles del Combo',
      description: 'Información del combo seleccionado.',
      content: <ApsListResponsive list={content} />,
      closeBtn: true,
      handleOk: isAvailable ? () => handleAddToInventory(combo) : null,
      okBtnText: isAvailable ? 'Agregar al Inventario' : undefined,
      titleOk: isAvailable ? 'Agregar al Inventario' : undefined,
      okProps: {
        endIcon: <Save />,
      },
    };
  };

  const handleAddToInventory = (combo) => {
    const objAddToInventory = {
      id_branch: id_branch,
      id_inventory: id_inventory,
      sale_price: combo.sale_price,
      id_organization: auth.user.id_organization,
      id_product: combo.id_product,
      isCombo: true,
      quantityProduct: combo.quantityProduct,
    };

    dispatch(inventoryBranchCreateOneitemAction(objAddToInventory)).then(() => {
      dispatch(inventoryBranchListComboAction({ id_branch, id_inventory }));
    });
  };

  const handleClick = (combo) => {
    dispatch(
      setApsGlobalModalPropsAction(createModalProps(combo, combo.isAvailable))
    );
  };

  return (
    <>
      {!processing ? (
        <Paper sx={stylesPaper}>
          <Grid container spacing={2}>
            {availableCombos.map((combo) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={combo.id}>
                <Card
                  sx={stylesCard(combo.isAvailable)}
                  onClick={() => handleClick(combo)} // Mantenemos el onClick activo
                >
                  {processingProductList && (
                    <CircularProgress sx={stylesSpinner} />
                  )}
                  <img src={combo.photo} alt={combo.name} style={stylesImage} />
                  <CardContent>
                    <Typography variant="h6">{combo.name}</Typography>
                    <Typography variant="body2">{combo.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default CombosCard;
