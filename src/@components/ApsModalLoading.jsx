import React from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';

const ApsModalLoading = ({ open, message }) => {
  return (
    <Modal open={open} onClose={null}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          minWidth: '350px',
        }}
      >
        <CircularProgress />
        <p>{message}</p>
      </Box>
    </Modal>
  );
};

export default ApsModalLoading;
