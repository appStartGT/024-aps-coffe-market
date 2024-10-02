import React from 'react';
import {
  Grid,
  Paper,
  List,
  ListItemText,
  Switch,
  ListItem,
  Typography,
} from '@mui/material';
import Can from '@components/permissions/Can';
import ApsInfoAlert from '@components/ApsInfoAlert';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
  maxHeight: 'calc(100vh - 450px)',
};

const stylesList = {
  display: 'grid',
  gridTemplateColumns: {
    md: '1fr 1fr',
    xs: '1fr',
  },
  columnGap: '100px',
};

const PermissionList = ({
  list = [],
  onClick,
  handleDisabled,
  // loading,
  screenName,
  can,
  checkSelectedItmes,
}) => {
  return (
    <Grid
      container
      component={Paper}
      sx={stylesPaper}
      elevation={0}
      overflow={'auto'}
    >
      <Grid item md={12}>
        <Typography
          variant="body1"
          color="primary"
          style={{ fontWeight: 'bold' }}
        >{`Permisos ${screenName}`}</Typography>
        {
          <Can {...can} passThrough>
            {(allowed) => (
              <>
                {!allowed && (
                  <ApsInfoAlert
                    text="No tienes permisos para habilitar o deshabilitar permisos."
                    severity="error"
                    divStyle={{
                      marginTop: '16px',
                      marginBottom: '0px',
                    }}
                  />
                )}
                <List sx={stylesList}>
                  {list?.map((permission, index) => (
                    <ListItem key={`permission-${index}`} divider>
                      <ListItemText primary={permission} />
                      <Switch
                        edge="end"
                        onChange={() => onClick(permission)}
                        disabled={!allowed || handleDisabled(permission)}
                        checked={checkSelectedItmes(permission)}
                        value={permission}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Can>
        }
      </Grid>
    </Grid>
  );
};

export default PermissionList;
