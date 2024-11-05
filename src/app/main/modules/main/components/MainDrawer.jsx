import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Avatar as MuiAvatar,
  Box,
  Drawer as MuiDrawer,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Person as PersonIcon, MoveToInbox } from '@mui/icons-material';
import ListNav from './ListNav';
import { useAuth } from '@hooks';
import MainDrawerToolbar from './MainDrawerToolbar';
import { makeStyles } from '@mui/styles';
import ImageViewer from '@components/ImageViewer';

const styledIcon = {
  color: (theme) => theme.palette.secondary[50],
};

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  '&.MuiAvatar-root': {
    width: '64px',
    height: '64px',
    marginBottom: theme.breakpoints.down('sm') ? '30px' : '30px',
  },
}));

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    padding: '0px 18px',
    whiteSpace: 'nowrap',
    width: open ? '240px' : '80px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
    boxSizing: 'border-box',
    position: theme.breakpoints.up('sm') ? 'relative' : 'absolute',
    overflowX: open ? 'visible' : 'hidden',
    border: 'none',
    marginLeft: '-9px',
    borderRadius: theme.breakpoints.down('sm') ? '12px' : '0px',
  },
}));

const useStyles = makeStyles(() => ({
  imageViewerContainer: {
    position: 'relative',
  },
}));

const MainDrawer = ({ openDrawer, setOpenDrawer }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isUpSM = useMediaQuery(theme.breakpoints.up('sm'));
  const auth = useAuth();
  const [routes, setRoutes] = useState([]);
  const [openViewer, setOpenViewer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer((open) => !open);
  };

  useEffect(() => {
    const userRoutes = [
      {
        id: 1,
        to: 'purchase',
        icon: <MoveToInbox sx={styledIcon} />,
        name: 'Compras',
      },
      {
        id: 2,
        to: 'expense',
        icon: <MoveToInbox sx={styledIcon} />,
        name: 'Egresos Varios',
      },
    ];
    setRoutes(userRoutes);
  }, [auth.user]);

  return (
    <Drawer
      variant={isUpSM ? 'permanent' : 'temporary'}
      open={openDrawer}
      onClose={toggleDrawer}
    >
      <MainDrawerToolbar
        auth={auth}
        toggleDrawer={toggleDrawer}
        openDrawer={openDrawer}
        styledIcon={styledIcon}
      />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginTop={{ md: '30px', xs: '18px' }}
        marginBottom="30px"
        width="100%"
      >
        <Avatar
          sx={{
            marginBottom: { xs: '8px !important', md: '12px !important' },
            cursor: 'pointer',
          }}
          src={auth.user?.photo}
          onClick={() => auth.user?.photo && setOpenViewer(true)}
        >
          <PersonIcon color="primary" fontSize="large" />
        </Avatar>
        <div className={classes.imageViewerContainer}>
          <ImageViewer
            open={openViewer}
            onClose={() => setOpenViewer(false)}
            images={[{ src: auth.user?.photo, alt: 'Profile image' }]}
          />
        </div>
        {openDrawer && (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="subtitle1">{auth.user?.name}</Typography>
            <Typography sx={{ fontSize: '0.9rem' }}>
              {auth.user?.organization?.branch?.name}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem' }}>
              {auth.user?.organization?.name}
            </Typography>
          </Box>
        )}
      </Box>
      <ListNav routes={routes} open={openDrawer} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'auto',
          bottom: 0,
          position: 'absolute',
        }}
      >
        Logo aqui o footer
      </Box>
    </Drawer>
  );
};

export default MainDrawer;
