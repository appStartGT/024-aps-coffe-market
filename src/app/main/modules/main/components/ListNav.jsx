import React, { Fragment, useEffect, useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NavLink, useLocation } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch } from 'react-redux';
import { setCurrentModule } from '../../../../store/modules/main';
import Can from '@components/permissions/Can';
import { permissions } from '@utils';

const iconListClass = {
  '&.MuiListItemIcon-root': { minWidth: 'auto' },
};

const iconListClassOpen = {
  '&.MuiListItemIcon-root': { minWidth: '36px' },
};

const ListNavItem = ({
  route,
  sx = {},
  showLeftIcon = false,
  onClick,
  showSubItems = false,
  open = false,
  // isSelected,
}) => {
  const theme = useTheme();

  return (
    <ListItemButton
      component={NavLink}
      to={route.to}
      onClick={onClick}
      sx={{
        ...sx,
        '&.active': {
          backgroundColor: theme.palette.sidebar.itemSelected,
          color: theme.palette.sidebar.textItemSelected,
          '& .MuiListItemIcon-root': {
            color: `${theme.palette.sidebar.iconItemSelected} !important`,
          },
        },
      }}
    >
      <>
        <ListItemIcon sx={open ? iconListClassOpen : iconListClass}>
          {route.icon}
        </ListItemIcon>
        {open && (
          <ListItemText
            primary={route.name}
            sx={{ color: (theme) => theme.palette.secondary[50] }}
            primaryTypographyProps={{ variant: 'caption', fontWeight: '450' }}
          />
        )}
        {showLeftIcon && (
          <KeyboardArrowDownIcon
            sx={{
              color: (theme) => theme.palette.secondary[50],
              transform: showSubItems ? 'rotate(-180deg)' : 'rotate(0)',
              transition: '0.4s',
            }}
          />
        )}
      </>
    </ListItemButton>
  );
};

const ListNav = ({ routes, open }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showSubItems, setShowSubItmes] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const { Subjects } = permissions;

  //validate when page is refreshed useEffect
  useEffect(() => {
    if (routes.length && !selectedId) {
      const fatherRoute = location.pathname.split('/')[2]; //father routes
      const childRoute = location.pathname.split('/')[3]; //child selected
      const route = routes.find((route) => route.to === fatherRoute);
      if (childRoute && route?.children) {
        setShowSubItmes(true);
      }
    }
  }, [location, routes]);

  return (
    <List
      sx={{
        // marginLeft: open ? '20px' : '10px',
        // marginRight: open ? '20px' : '10px',
        display: 'flex',
        flexDirection: 'column',
        rowGap: '4px',
        alignItems: open ? 'none' : 'center',
        width: '100%',
      }}
    >
      {routes.map((route, index) => (
        <Fragment key={`ListNavItem1${index}`}>
          <Can
            I={route.name}
            key={`Can-1${index}`}
            a={Subjects.MAIN_NAVIGATION}
          >
            <ListNavItem
              sx={{ borderRadius: '8px', padding: '4px' }}
              route={route}
              open={open}
              showLeftIcon={route.children?.length && open}
              showSubItems={showSubItems}
              // isSelected={route.id === selectedId}
              onClick={() => {
                route.children?.length && open
                  ? (setShowSubItmes((prev) => !prev), setSelectedId(route.id))
                  : setSelectedId(route.id);
                dispatch(setCurrentModule(route.to));
              }}
            />
            {showSubItems &&
              open &&
              route.children?.map((child, index) => (
                <Can
                  key={`Can-2${index}`}
                  I={child.name}
                  a={Subjects.MAIN_NAVIGATION}
                >
                  <ListNavItem
                    sx={{
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      marginTop: '8px',
                      borderRadius: '8px',
                      marginLeft: '16px',
                      width: { sm: '221px', xs: '178px' },
                    }}
                    key={`ListNavItem2${index}`}
                    route={child}
                    open={open}
                    onClick={() => setSelectedId(child.id)}
                    // isSelected={child.id === selectedId}
                  />
                </Can>
              ))}
          </Can>
        </Fragment>
      ))}
    </List>
  );
};

export default React.memo(ListNav);
