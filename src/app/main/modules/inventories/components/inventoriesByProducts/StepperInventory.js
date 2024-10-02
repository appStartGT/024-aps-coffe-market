import React from 'react';

import StepperModal from './StepperModal';

const StepperInventory = ({ openStepper, setOpenStepper }) => {
  const propsModalStep = {
    open: openStepper,
    onClose: () => handleClose(),
    maxWidth: 'md',
    title: 'Agregar Productos',
    description: 'Productos al inventario',
    content: (
      <>
        <StepperModal
          openStepper={openStepper}
          setOpenStepper={setOpenStepper}
        ></StepperModal>
      </>
    ),
    handleOk: null,
    handleCancel: null,
  };

  const handleClose = () => {
    setOpenStepper(false);
  };

  return {
    propsModalStep,
  };
};

export default StepperInventory;
