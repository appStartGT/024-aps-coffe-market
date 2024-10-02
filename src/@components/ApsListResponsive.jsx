import React from 'react';
import {
  Grid,
  ListItemText,
  List,
  ListItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

const ApsListResponsive = ({ list = [] }) => {
  const theme = useTheme();
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
          item.subtitle?.length ? (
            <div
              key={`elemento-list-${index}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Typography
                variant="subtitle1"
                style={{
                  marginLeft: '16px',
                  marginTop: '24px',
                  marginBottom: '0px',
                  fontSize: '16px',
                }}
              >
                {item.title}
              </Typography>
              {item.subtitle?.map((item, index) => (
                <ul
                  key={`elemento-ul-${index}`}
                  style={{
                    marginTop: '4px',
                    marginBottom: '4px',
                    paddingInlineStart: '16px',
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
                      <span
                        style={{
                          flex: 1,
                          color: theme.palette.text.subtitle,
                          fontSize: '14px',
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          color: theme.palette.text.subtitle,
                          fontSize: '14px',
                        }}
                      >
                        {`Q ${
                          item?.subtotal?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || '0.00'
                        }`}
                      </span>
                    </li>
                  </Tooltip>
                  {item.length > 1 && (
                    <span
                      style={{
                        fontStyle: 'italic',
                        color: theme.palette.text.disabled,
                        fontSize: '14px',
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
          ) : null
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
                  primary={
                    <Typography variant="body1">{item.title}</Typography>
                  }
                  secondary={
                    <Typography
                      style={{
                        color: theme.palette.text.subtitle,
                      }}
                      variant="body2"
                    >{`${
                      item.title === 'Total'
                        ? 'Q ' +
                          (item?.subtitle?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || '0.00')
                        : item.subtitle
                    }`}</Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
        )
      )}
    </Grid>
  );
};

export default ApsListResponsive;
