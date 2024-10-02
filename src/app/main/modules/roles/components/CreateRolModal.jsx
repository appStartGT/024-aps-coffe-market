import React from 'react';
import ApsModal from '@components/ApsModal';
import ApsForm from '@components/ApsForm';
import SaveIcon from '@mui/icons-material/Save';

const CreateRolModal = ({ open, setOpen, formik, handleOnclick }) => {
  const handleClose = () => {
    setOpen(false);
    formik.clearForm();
  };

  return (
    <ApsModal
      //closeBtn
      open={open}
      onClose={() => handleClose()}
      maxWidth="sm"
      title="Crear rol"
      description="Complete los campos para crear el rol."
      content={<ApsForm title="" formik={formik} />}
      handleOk={() => {
        handleOnclick();
        handleClose();
      }}
      titleOk="Guardar"
      handleCancel={() => handleClose()}
      titleCancel="Cancelar"
      okProps={{
        disabled: !formik.form.isValid,
        endIcon: <SaveIcon />,
      }}
    />
  );
};

export default React.memo(CreateRolModal);
