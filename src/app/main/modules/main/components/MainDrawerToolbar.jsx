import {
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const MainDrawerToolbar = ({
  auth,
  setShowModal,
  toggleDrawer,
  openDrawer,
  styledIcon,
}) => {
  return (
    <Toolbar
      sx={(theme) => ({
        '&.MuiToolbar-root': {
          justifyContent: openDrawer ? 'space-between' : 'center',
          padding: '0px',
          margin: '0px',
          background: `${theme.palette.sidebar.background} !important`,
        },
      })}
    >
      {
        <Box
          sx={{
            display: openDrawer ? 'flex' : 'none',
            gap: '12px',
          }}
        >
          {Boolean(auth?.user?.usersToAssist?.length) && (
            <Tooltip title="Seleccione el usuario a asistir">
              <IconButton
                sx={{
                  width: '44px !important',
                  height: '44px !important',
                  marginLeft: '12px',
                }}
                disabled={Boolean(!auth?.user?.usersToAssist?.length)}
                onClick={() => {
                  setShowModal((v) => !v);
                }}
              >
                <Avatar
                  color={'secondary'}
                  src={auth?.assitSession?.photo || ''}
                />
              </IconButton>
            </Tooltip>
          )}
          {/* {Boolean(!auth?.user?.usersToAssist?.length) && (
            <img src={'/img/svg/headerLogo.svg'} style={{ maxWidth: '90px' }} />
          )} */}

          <Box display="flex" flexDirection="column" justifyContent={'center'}>
            {auth?.assitSession?.person?.names && (
              <Typography
                sx={{
                  textWrap: 'wrap',
                }}
                children={`${auth?.assitSession?.person?.names} ${auth?.assitSession?.person?.surNames}`}
                variant="subtitle2"
              />
            )}

            {auth?.assitSession?.email && (
              <Typography
                children={auth?.assitSession?.email}
                variant="overline"
              />
            )}
          </Box>
        </Box>
      }
      <IconButton onClick={toggleDrawer} sx={styledIcon}>
        {openDrawer ? (
          <ChevronLeftIcon sx={{ width: '38px', height: 'auto' }} />
        ) : (
          <MenuIcon />
        )}
      </IconButton>
    </Toolbar>
  );
};

export default MainDrawerToolbar;
