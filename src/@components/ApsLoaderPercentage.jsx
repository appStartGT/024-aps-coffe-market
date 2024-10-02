import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function ApsLoaderPercentage({ progress, ...props }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        color="primary"
        size={40}
        variant="determinate"
        value={progress}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="primary">
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  );
}
