import React from 'react';
import ApsModal from '@components/ApsModal';
import ApsForm from '@components/ApsForm';
import SaveIcon from '@mui/icons-material/Save';
import useCreatePersonForm from '../hooks/useCreatePersonForm';

const CreatePersonModal = () => {
  const {
    formik,
    handleOnclick,
    processing,
    isPersonModalOpen,
    onClose,
    selectedPerson,
  } = useCreatePersonForm();

  return (
    <ApsModal
      //closeBtn
      open={isPersonModalOpen}
      onClose={onClose}
      maxWidth="md"
      title={selectedPerson ? 'Actualizar persona' : 'Registrar persona'}
      description={
        selectedPerson
          ? 'Actualice la información.'
          : 'Complete los campos para crear un nuevo registro.'
      }
      content={
        <ApsForm title="" formik={formik} handleSubmit={handleOnclick} />
      }
      handleOk={handleOnclick}
      titleOk="Guardar"
      handleCancel={onClose}
      titleCancel="Cancelar"
      okProps={{
        endIcon: <SaveIcon />,
        disabled: !formik.form.isValid || processing,
      }}
    />
  );
};

export default React.memo(CreatePersonModal);
