import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const stepsExample = ['STEP 1', 'STEP 2', 'STEP 3', 'STEP 4'];

/**
 * EXAMPLE
 * <ApsStepper
 *  activeStep={0}
 *  steps={['STEP 1', 'STEP 2', 'STEP 3', 'STEP 4']}
 *  stepperProps={{}}
 * />
 */

const ApsStepper = ({ activeStep = 0, steps = stepsExample, stepperProps }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel {...stepperProps}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
export default React.memo(ApsStepper);
