import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const DataItem = ({ value, label, backgroundColor, color }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minWidth: '120px',
        borderRadius: '10px',
      }}
    >
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            color,
            fontWeight: 'bold',
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color,
            mt: 1,
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DataItem;
