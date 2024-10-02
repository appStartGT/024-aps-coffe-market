import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FormWrapper = ({
  children,
  title,
  sxTittle,
  sxWrapper = {},
  backButtonCallback,
}) => {
  return (
    <Box
      sx={(theme) => ({
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: theme.palette.background.paper,
        maxHeight: '728px',
        maxWidth: '500px',
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        padding: { xs: '30px', sm: '60px', md: '60px' },
        boxShadow: '16px 16px 16px rgba(0, 0, 0, 0.25);',
        [theme.breakpoints.down('sm')]: {
          maxHeight: '460px',
        },
        ...sxWrapper,
      })}
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        marginBottom="50px"
        width="100%"
      >
        {backButtonCallback && (
          <IconButton
            onClick={() => {
              typeof backButtonCallback == 'function' && backButtonCallback();
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography
          variant="h1"
          color="primary"
          sx={{ flex: '1', ...sxTittle }}
        >
          {title}
        </Typography>
      </Box>

      {children}
    </Box>
  );
};

export default FormWrapper;
