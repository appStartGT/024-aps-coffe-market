import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Step, StepLabel, Stepper } from '@mui/material';
import ApsTextField from '@components/ApsTextField';
import ApsButton from '@components/ApsButton';
import { setApsGlobalModalPropsAction } from '../../../../store/modules/main';
import useSaleForm from '../hooks/useSaleForm';

const SaleDetailForm = ({ id_sale, nonupdate }) => {
  const dispatch = useDispatch();
  const processing = useSelector((state) => state.saleDetail.processing);
  const [activeStep, setActiveStep] = React.useState(0);

  const { formikSale, handleOnclick } = useSaleForm({ navigate: () => {} });

  const steps = ['Detalles de la venta', 'Confirmación'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = () => {
    handleOnclick();
    dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  return (
    <form onSubmit={formikSale.form.handleSubmit}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {activeStep === 0 && (
          <>
            {formikSale.fields.map((field) => (
              <Grid item {...field.gridProps} key={field.id}>
                <ApsTextField
                  {...field}
                  {...formikSale.form.getFieldProps(field.name)}
                  error={
                    formikSale.form.touched[field.name] &&
                    Boolean(formikSale.form.errors[field.name])
                  }
                  helperText={
                    formikSale.form.touched[field.name] &&
                    formikSale.form.errors[field.name]
                  }
                />
              </Grid>
            ))}
          </>
        )}
        {activeStep === 1 && (
          <Grid item xs={12}>
            <p>
              Por favor, confirme los detalles de la venta antes de guardar.
            </p>
          </Grid>
        )}
        <Grid item xs={12}>
          <ApsButton
            fullWidth
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? onSubmit : handleNext}
            loading={processing}
          >
            {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
          </ApsButton>
        </Grid>
        {activeStep > 0 && (
          <Grid item xs={12}>
            <ApsButton fullWidth variant="outlined" onClick={handleBack}>
              Atrás
            </ApsButton>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default SaleDetailForm;
