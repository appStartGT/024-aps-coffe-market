import React from 'react';
import { useTheme } from '@emotion/react';
import { Alert } from '@mui/material';

const ApsInfoAlert = ({
  text = '',
  divStyle = { marginTop: '8px', marginBottom: '24px' },
  severity = 'info',
  ...props
}) => {
  const theme = useTheme();
  const colorsConfig =
    severity == 'info'
      ? {
          backgroundColor: theme.palette.primary[50],
          borderColor: theme.palette.primary[800],
          iconColor: theme.palette.primary[800],
          textColor: 'black !important',
        }
      : severity == 'error'
      ? {
          backgroundColor: theme.palette.error[50],
          borderColor: theme.palette.error[800],
          iconColor: theme.palette.error[800],
          textColor: 'black !important',
        }
      : severity == 'success'
      ? {
          backgroundColor: theme.palette.success[50],
          borderColor: theme.palette.success[800],
          iconColor: theme.palette.success[800],
          textColor: 'black !important',
        }
      : severity == 'warning'
      ? {
          backgroundColor: theme.palette.warning[50],
          borderColor: theme.palette.warning[800],
          iconColor: theme.palette.warning[800],
          textColor: 'black !important',
        }
      : {
          backgroundColor: theme.palette.primary[50],
          borderColor: theme.palette.primary[800],
          iconColor: theme.palette.primary[800],
          textColor: 'black !important',
        };

  return (
    <div style={divStyle}>
      <Alert
        severity={severity}
        variant="outlined"
        sx={{
          backgroundColor: colorsConfig.backgroundColor,
          borderColor: colorsConfig.borderColor,
          '.MuiAlert-icon': {
            color: colorsConfig.iconColor,
          },
          color: colorsConfig.textColor,
        }}
        {...props}
      >
        {text}
      </Alert>
    </div>
  );
};

export default ApsInfoAlert;
