import { Edit as EditIcon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

const CardInfo = ({ title, subTitle, onClick }) => {
  return (
    <Box display={'flex'} justifyContent={'space-between'}>
      <Box>
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        <Typography variant="body">{subTitle}</Typography>
      </Box>
      <Button
        style={{ textTransform: 'none', fontSize: '18px' }}
        onClick={onClick}
      >
        <EditIcon color="primary" sx={{ marginRight: '8px' }} />
        Edit
      </Button>
    </Box>
  );
};

export default CardInfo;
