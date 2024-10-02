export const overrideComponents = (palette = {}) => {
  const textField = {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            // color: palette.primary['A200'],
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          input: {
            //color: palette.primary['500'],
          },
          ':after': {
            //borderBottomColor: palette.primary['A200'],
          },
          '&.Mui-focused': {
            //backgroundColor: palette.primary[50],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          input: {
            //color: palette.primary['500'],
          },
          ':after': {
            //borderBottomColor: palette.primary['A200'],
          },
          '&.Mui-focused': {
            //backgroundColor: palette.primary[50],
          },
          borderRadius: '12px',
        },
      },
    },
  };

  const muiDrawer = {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: `${palette.sidebar.background} !important`, // Aquí puedes establecer el color de fondo deseado para el muiDrawer
        },
      },
    },
  };

  const muiToolbar = {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: `${palette.toolbar.background} !important`,
        },
      },
    },
  };

  /*   const muiIcons = {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: `${palette.icon.main}`,
        },
      },
    },
  }; */

  return { ...textField, ...muiDrawer, ...muiToolbar /* ...muiIcons */ };
};
