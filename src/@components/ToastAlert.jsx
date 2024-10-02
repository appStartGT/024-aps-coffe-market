import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Close from '@mui/icons-material/Close';
import AlertCircle from '@mui/icons-material/CircleNotifications';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Toast from 'react-hot-toast';

export const CustomToast = ({ toast, variant, title, message }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {variant === 'error' ? (
          <AlertCircle sx={{ mr: 3, width: 40, height: 40 }} color="error" />
        ) : (
          <CheckCircle sx={{ mr: 3, width: 40, height: 40 }} color="success" />
        )}
        <Box>
          <Typography sx={{ fontWeight: 500 }}>
            {title || variant === 'error' ? 'Algo salió mal' : 'Completado'}
          </Typography>
          <Typography variant="caption">{message}</Typography>
        </Box>
      </Box>
      <IconButton onClick={() => Toast.dismiss(toast.id)}>
        <Close fontSize="small" />
      </IconButton>
    </Box>
  );
};
