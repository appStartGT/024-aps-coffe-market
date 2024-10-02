import React from 'react';
import ApsModal from '@components/ApsModal';
import ApsForm from '@components/ApsForm';
import SaveIcon from '@mui/icons-material/Save';

const CreateItemsModal = ({
  open,
  setOpen,
  formik,
  loading,
  handleOnclick,
}) => {
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
      title="Nuevo"
      description="Complete los campos."
      content={<ApsForm title="" formik={formik} />}
      handleOk={handleOnclick}
      titleOk="Guardar"
      handleCancel={() => handleClose()}
      titleCancel="Cancelar"
      okProps={{
        disabled: !formik.form.isValid || loading,
        endIcon: <SaveIcon />,
      }}
    />
  );
};

export default React.memo(CreateItemsModal);
