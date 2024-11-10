import React from 'react';
import { Typography, Paper, Box, IconButton } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const DataItem = ({ value, label, backgroundColor, color, onClick }) => {
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
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
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
      {onClick && (
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            color,
          }}
        >
          <SwapVertIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};

export default DataItem;