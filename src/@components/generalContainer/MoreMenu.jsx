import * as React from 'react';
//IMPORT COMPONENTS
import {
  IconButton,
  useMediaQuery,
  Divider,
  ListItemIcon,
  MenuItem,
  Menu,
  Drawer,
} from '@mui/material';
//IMPORT ICONS
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
//IMPORT STYLES
import { styled } from '@mui/styles';
import { useTheme } from '@emotion/react';

const StyledMenu = styled((props) => (
  <Menu
    elevation={8}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(() => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    paddingTop: 0,
    paddingBottom: 0,
    width: 375,
  },
}));

const drawerBottomStyle = {
  '& .MuiDrawer-paper': {
    borderRadius: '12px 12px 0px 0px',
  },
};
const menuStyle = {
  '.MuiMenu-list': {
    paddingTop: 0,
    paddingBottom: 0,
  },
};

export default function MoreMenu({ actions = [] }) {
  //MUI
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  //STATES
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  //FUNCTIONS
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <IconButton
        onClick={sm ? handleDrawerOpen : handleClick}
        sx={{ ml: '8px', height: '36px', width: '36px' }}
      >
        <MoreHorizIcon color="primary" />
      </IconButton>
      <StyledMenu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={menuStyle}
      >
        {actions.length &&
          actions.map((item, index) =>
            itemAction({ item, index, totalItems: actions.length })
          )}
      </StyledMenu>
      <Drawer
        anchor={'bottom'}
        open={openDrawer}
        onClose={handleDrawerClose}
        sx={drawerBottomStyle}
      >
        {actions.length &&
          actions.map((item, index) =>
            itemAction({ item, index, totalItems: actions.length })
          )}
      </Drawer>
    </>
  );
}
//ARROW FUNCTIONS
const itemAction = ({ item, index, totalItems }) => (
  <div key={item.id}>
    <MenuItem onClick={item.onClick} sx={{ height: '56px' }}>
      <ListItemIcon>{item.icon}</ListItemIcon>
      {item.title}
    </MenuItem>
    {index < totalItems - 1 && <Divider style={{ margin: 0 }} />}
  </div>
);
