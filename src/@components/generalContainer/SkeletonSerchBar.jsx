import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';

const SkeletonSerchBar = () => {
  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      gap={'16px'}
      alignItems={'center'}
      sx={{
        marginBottom: '16px',
      }}
    >
      <Skeleton variant="rounded" width={'100%'} height={60} />
      <Skeleton variant="circular" width={'48px'} height={'48px'} />
    </Box>
  );
};

export default SkeletonSerchBar;
