import React from 'react';
import { Typography } from '@mui/material';
import ApsModal from '@components/ApsModal';
import DeleteIcon from '@mui/icons-material/Delete';

const ApsModalDelete = ({
  open,
  title,
  text,
  onClose,
  handleOk,
  processing,
}) => {
  return (
    <ApsModal
      open={open}
      onClose={onClose}
      title={title}
      content={<Typography>{text}</Typography>}
      handleOk={handleOk}
      titleOk="Eliminar"
      handleCancel={onClose}
      titleCancel="Cancelar"
      okProps={{
        color: 'error',
        endIcon: <DeleteIcon />,
        disabled: processing,
      }}
    />
  );
};

export default React.memo(ApsModalDelete);
