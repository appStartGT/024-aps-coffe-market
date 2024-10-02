import React from 'react';
import ApsModal from '@components/ApsModal';
import ApsForm from '@components/ApsForm';
import SaveIcon from '@mui/icons-material/Save';
import useCreateUserForm from '../hooks/useCreateUserForm';

const CreateUserModal = ({ id_user_type, id_organization, id_branch }) => {
  const {
    formik,
    handleOnclick,
    processing,
    isUserModalOpen,
    onClose,
    selectedUser,
  } = useCreateUserForm({ id_user_type, id_organization, id_branch });

  return (
    <ApsModal
      //closeBtn
      open={isUserModalOpen}
      onClose={onClose}
      maxWidth="md"
      title={selectedUser ? 'Actualizar usuario' : 'Registra un nuevo usuario'}
      description={
        selectedUser
          ? 'Actualice la información del usuario.'
          : 'Complete los campos para registrar un nuevo usuario.'
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

export default React.memo(CreateUserModal);
