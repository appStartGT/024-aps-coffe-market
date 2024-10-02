import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper as MuiPaper, Box as MuiBox } from '@mui/material';

const Paper = styled(MuiPaper)(({ theme }) => ({
  backgroundColor: theme.palette.primary['50'],
  display: 'flex',
  flexDirection: 'column',
}));

const Box = styled(MuiBox)(({ theme }) => ({
  height: 12,
  width: '100%',
  borderRadius: '8px 8px 0px 0px',
  backgroundColor: theme.palette.primary[400],
}));

const ActionsTab = ({ children, ...props }) => {
  return (
    <Paper {...props}>
      <Box />
      {children}
    </Paper>
  );
};

export default React.memo(ActionsTab);
