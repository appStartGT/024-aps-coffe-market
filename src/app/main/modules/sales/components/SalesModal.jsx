import { Grid, Box, Button, Typography, Paper } from '@mui/material';
import ApsForm from '@components/ApsForm';
import ProductList from './ProductList';
import ProductSummaryList from './ProductSummaryList';
import useFormSales from '../hooks/useFormSales';
import ApsModal from '@components/ApsModal';
import ApsButton from '@components/ApsButton';
import { Save } from '@mui/icons-material';

const SalesModal = () => {
  const {
    activeStep,
    checkedItems,
    formik,
    handleBack,
    handleConfirm,
    handleNext,
    handleOpen,
    handleRemoveItem,
    isSaleModalOpen,
    processing,
    productInventoryList,
    propsSearchBarButton,
    quantityInputs,
    searchList,
    setCheckedItems,
    setQuantityInputs,
  } = useFormSales();

  const propsSaleModal = {
    open: isSaleModalOpen,
    onClose: () => handleOpen(false),
    title: 'Venta',
    content: (
      <>
        {activeStep === 0 && (
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} md={6} padding={'12px'}>
              <ProductList
                items={searchList || productInventoryList}
                propsSearchBarButton={propsSearchBarButton}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
                quantityInputs={quantityInputs}
                setQuantityInputs={setQuantityInputs}
              />
            </Grid>
            <Grid item xs={12} md={6} padding={'12px'}>
              <ProductSummaryList
                items={productInventoryList}
                quantities={quantityInputs}
                onRemove={handleRemoveItem}
                // handleTotal={handleTotal}
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} md={6} padding={'12px'}>
              <Box overflow={'auto'} height={'100%'}>
                <ProductSummaryList
                  items={productInventoryList}
                  quantities={quantityInputs}
                  onRemove={handleRemoveItem}
                  // handleTotal={handleTotal}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} padding={'12px'}>
              <Paper
                elevation={0}
                sx={{ padding: '20px', borderRadius: '16px', height: '100%' }}
              >
                <Typography variant="subtitle1" mb={2}>
                  Datos para la venta
                </Typography>
                <ApsForm formik={formik} />
              </Paper>
            </Grid>
          </Grid>
        )}

        {checkedItems.length > 0 && activeStep === 0 && (
          <Box position="fixed" bottom="16px" right="16px">
            <Button variant="contained" color="primary" onClick={handleNext}>
              Cobrar
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box position="fixed" bottom="16px" right="16px">
            <Button
              variant="contained"
              onClick={handleBack}
              style={{ marginRight: '8px' }}
              disabled={processing}
            >
              Atrás
            </Button>
            <ApsButton
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={!formik.form.isValid || processing}
              endIcon={<Save />}
            >
              Confirmar
            </ApsButton>
          </Box>
        )}
      </>
    ),
    closeBtn: true,
    handleOk: null,
    handleCancel: null,
    dialogProps: {
      fullScreen: true,
      PaperProps: {
        sx: (theme) => ({ background: theme.palette.background.default }),
      },
    },
  };

  return <ApsModal {...propsSaleModal} />;
};

export default SalesModal;
