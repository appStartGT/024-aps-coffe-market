import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '@hooks';
import DailyBudget from './DailyBudget';
import BudgetSelect from './budget/BudgetSelect';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary['50'],
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const MainAppBar = ({ sx, setOpenDrawer, isScrollingUp }) => {
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    auth.logout();
  };

  return (
    <AppBar elevation={0} position="absolute" sx={sx}>
      <Toolbar
        sx={(theme) => ({
          '&.MuiToolbar-root': {
            background: `${theme.palette.appbar.background} !important`,
            paddingLeft: 0,
            paddingRight: 0,
            display: 'flex',
            justifyContent: { md: 'end', xs: 'space-between' },
            ...(isScrollingUp
              ? {
                  boxShadow: '0px 13px 14px -11px rgb(0 0 0 / 25%)',
                  transition: 'transform ease 0.5s, box-shadow ease 0.5s',
                }
              : {}),
          },
        })}
      >
        <Box
          sx={() => ({
            width: '100%',
            // maxWidth: '232px',
            display: { xs: 'block', md: 'none' }, // Show only on mobile and tablet
          })}
        >
          <IconButton
            color="primary"
            sx={{
              minHeight: '48px',
              minWidth: '48px',
              margin: '4px',
            }}
            onClick={() => {
              setOpenDrawer((open) => !open);
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <BudgetSelect />
        <Box>
          <DailyBudget />
          <Tooltip title="Account settings">
            <IconButton
              color="primary"
              sx={{
                minHeight: '48px',
                minWidth: '48px',
                margin: '8px',
              }}
              onClick={handleClick}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogOut}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Cerrar sesion
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MainAppBar;
