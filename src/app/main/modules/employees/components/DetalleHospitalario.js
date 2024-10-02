import React from 'react';
import {
  Grid,
  ListItemText,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';

const DetalleHospitalario = ({ list = [] }) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginBottom: '16px',
      }}
    >
      {list?.map((item, index) =>
        item.title === 'Productos' ? (
          <div
            key={`product-list-${index}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Typography
              style={{
                marginLeft: '16px',
                marginTop: '24px',
                marginBottom: '24px',
              }}
            >
              Productos
            </Typography>
            {item.subtitle.map((item, index) => (
              <ul
                key={`product-ul-${index}`}
                style={{
                  marginTop: '4px',
                  marginBottom: '4px',
                  paddingInlineStart: '20px',
                }}
              >
                <Tooltip
                  title={
                    item.deleted
                      ? 'Este producto ya no está disponible actualmente en el producto'
                      : ''
                  }
                >
                  <li
                    style={{
                      textDecoration: item.deleted ? 'line-through' : '',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <span>
                      {`Q ${item.subtotal?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </span>
                  </li>
                </Tooltip>
                {item.length > 1 && (
                  <span
                    style={{
                      fontStyle: 'italic',
                      color: theme.palette.text.disabled,
                    }}
                  >
                    {`Y ${item.length - 1} ${
                      item.length > 2 ? 'productos' : 'producto'
                    } más.`}
                  </span>
                )}
              </ul>
            ))}
          </div>
        ) : (
          <Grid
            style={{
              marginTop: '12px',
              paddingTop: '0px',
              paddingBottom: '0px',
            }}
            key={index}
            item
            xs={item.xs || 12}
            sm={item.sm || 6}
            md={item.md || 6}
            lg={item.lg || 6}
          >
            <List style={{ paddingTop: '0px', paddingBottom: '0px' }}>
              <ListItem style={{ padding: '0px' }}>
                <ListItemText
                  primary={item.title}
                  secondary={`${
                    item.title === 'Total'
                      ? 'Q ' +
                        item.subtitle.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : item.subtitle
                  }`}
                />
              </ListItem>
            </List>
          </Grid>
        )
      )}
    </Grid>
  );
};

export default DetalleHospitalario;
