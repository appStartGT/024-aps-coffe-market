import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Box, Stack } from '@mui/material';

const SkeletonHeaderContainer = ({ props }) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      marginBottom={'24px'}
    >
      <Stack spacing={2} width={'100%'}>
        <Skeleton
          variant="rounded"
          width={'100%'}
          height={'12px'}
          sx={{ maxWidth: '300px' }}
          {...props}
        />
        <Skeleton
          variant="rounded"
          width={'100%'}
          height={'44px'}
          sx={{ maxWidth: '300px' }}
          {...props}
        />
        <Skeleton
          variant="rounded"
          width={'100%'}
          height={'28px'}
          sx={{ maxWidth: '600px' }}
          {...props}
        />
      </Stack>
      <Skeleton
        variant="rounded"
        width={'100%'}
        height={'44px'}
        sx={{ maxWidth: '120px' }}
        {...props}
      />
    </Box>
  );
};

export default SkeletonHeaderContainer;
