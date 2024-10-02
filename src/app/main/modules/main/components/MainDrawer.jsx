import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Avatar as MuiAvatar,
  Box,
  Drawer as MuiDrawer,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Groups as GroupsIcon,
  Outbox,
  MoveToInbox,
  CorporateFare,
} from '@mui/icons-material';
import ListNav from './ListNav';
import { useAuth } from '@hooks';
import UsersToassistModal from './UsersToAssistsListModal';
import MainDrawerToolbar from './MainDrawerToolbar';
import { makeStyles } from '@mui/styles';
import ImageViewer from '@components/ImageViewer';

const styledIcon = {
  color: (theme) => theme.palette.secondary[50],
};

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  '&.MuiAvatar-root': {
    [theme.breakpoints.down('sm')]: {
      width: '64px',
      height: '64px',
      marginBottom: '30px',
    },
    [theme.breakpoints.up('sm')]: {
      width: '64px',
      height: '64px',
    },
  },
}));

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    padding: '0px 18px',
    whiteSpace: 'nowrap',
    width: '240px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    [theme.breakpoints.up('sm')]: {
      position: 'relative',
      ...(!open && {
        overflowX: 'hidden',
        width: '80px',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }),
    },
    [theme.breakpoints.down('sm')]: {
      width: '200px',
      padding: '0px 18px',
      borderRadius: '12px',
    },
    border: 'none',
    marginLeft: '-9px',
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
  const [showModal, setShowModal] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer((open) => !open);
  };

  useEffect(() => {
    setRoutes(
      [
        {
          id: 1,
          to: 'product',
          icon: <MoveToInbox sx={styledIcon} />,
          name: 'Producto',
        },
        {
          id: 2,
          to: 'sales',
          icon: <Outbox sx={styledIcon} />,
          name: 'Ventas',
        },
        {
          id: 3,
          to: `organization/detail/${auth.user?.id_organization}`,
          icon: <CorporateFare sx={styledIcon} />,
          name: 'Organización',
        },
        {
          id: 4,
          to: 'organizations',
          icon: <CorporateFare sx={styledIcon} />,
          name: 'Organizaciones',
        },
        {
          id: 5,
          to: 'administrator',
          icon: <GroupsIcon sx={styledIcon} />,
          name: 'Administrador',
        },
        {
          id: 6,
          to: 'employee',
          icon: <PersonIcon sx={styledIcon} />,
          name: 'Nomina',
        },
        auth.user?.id_organization &&
          !auth.user?.id_branch &&
          !auth.user?.id_inventory && {
            id: 6,
            to: 'inventory',
            icon: <CorporateFare sx={styledIcon} />,
            name: 'Inventario',
          },
        auth.user?.id_organization &&
          auth.user?.id_branch &&
          auth.user?.id_inventory && {
            id: 3,
            to: `inventory/detail/${auth.user?.id_inventory}/${auth.user?.id_branch}`,
            icon: <CorporateFare sx={styledIcon} />,
            name: 'Inventario',
          },
      ].filter((e) => e)
    );
  }, [auth.user]);

  return (
    <>
      {auth?.user?.usersToAssist?.length && (
        <UsersToassistModal
          auth={auth}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <Drawer
        variant={isUpSM ? 'permanent' : 'temporary'}
        open={openDrawer}
        onClose={toggleDrawer}
      >
        <MainDrawerToolbar
          auth={auth}
          setShowModal={setShowModal}
          toggleDrawer={toggleDrawer}
          openDrawer={openDrawer}
          styledIcon={styledIcon}
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent={'center'}
          marginTop={{ md: '30px', xs: '18px' }}
          marginBottom="30px"
          width={'100%'}
        >
          <Avatar
            sx={{
              marginBottom: {
                xs: '8px !important',
                md: '12px !important',
                cursor: 'pointer',
              },
            }}
            color={'secondary'}
            open={openDrawer}
            src={auth.user?.photo}
            onClick={() => {
              if (auth.user?.photo) setOpenViewer(true);
            }}
          >
            <PersonIcon color={'primary'} fontSize="large" />
          </Avatar>
          <div className={classes.imageViewerContainer}>
            <ImageViewer
              open={openViewer}
              onClose={() => {
                setOpenViewer(false);
              }}
              images={[{ src: auth.user?.photo, alt: 'Profile image' }]}
            />
          </div>

          <Box
            display={openDrawer ? 'flex' : 'none'}
            flexDirection={'column'}
            alignItems="center"
          >
            <Typography
              sx={{
                textWrap: 'wrap',
              }}
              children={auth.user?.name}
              variant="subtitle1"
            />
            <Typography
              sx={{
                fontSize: '0.9rem',
              }}
              children={auth.user?.organization?.branch?.name}
            />
            <Typography
              sx={{
                fontSize: '0.8rem',
              }}
              children={auth.user?.organization?.name}
            />
          </Box>
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
    </>
  );
};

export default MainDrawer;
