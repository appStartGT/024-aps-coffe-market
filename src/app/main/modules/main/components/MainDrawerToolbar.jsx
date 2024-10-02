import { Box, IconButton, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const MainDrawerToolbar = ({ toggleDrawer, openDrawer }) => (
  <Toolbar
    sx={(theme) => ({
      '&.MuiToolbar-root': {
        justifyContent: openDrawer ? 'space-between' : 'center',
        padding: 0,
        margin: 0,
        background: `${theme.palette.sidebar.background} !important`,
      },
    })}
  >
    <Box
      sx={{
        display: 'flex',
        gap: '12px',
      }}
    >
      <Box
        sx={(theme) => ({
          width: '100%',
          maxWidth: '232px',
          backgroundColor: theme.palette.sidebar.background,
        })}
      >
        <IconButton
          color="primary"
          sx={{
            minHeight: '48px',
            minWidth: '48px',
            margin: '4px',
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  </Toolbar>
);

export default MainDrawerToolbar;
