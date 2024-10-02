import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useConfigTheme from '@config/themeConfig/useConfigTheme';

const CustomTheme = (props) => {
  const { theme } = useConfigTheme();
  const selectedTheme = createTheme(theme);

  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};

export default CustomTheme;
