import React from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import Can from './permissions/Can';

const stylesPaper = {
  padding: '24px',
  borderRadius: '16px',
  height: '100%',
  width: '100%',
  backgroundColor: '#E1E8ED',
};

const stylesPaperButton = {
  padding: '24px',
  borderRadius: '16px',
  height: '100%',
  width: '100%',
  backgroundColor: 'white',
};

const stylesCardTitle = {
  marginBottom: '8px',
  fontWeight: 'bold',
};

const stylesButtons = {
  textAlign: 'right',
  borderRadius: '20px',
  padding: '4px 16px',
  marginLeft: 'auto',
  marginTop: '8px',
};

/**
 * @param {object} styles { styles for the group of cards }
 * @param {array} cards [ array of objects ]
 *    - {string} type: quantity / button / quantityButton
 *    - {string} title: title of the card
 *    - {number} quantity: (if not button type)
 *    - {number} maxQuantity: (inf not button or quantityButton type)
 *    - {string} description: (if button type)
 *    - {string} buttonTitle: if it has a button
 *    - {function} buttonFunction: to excecute when button is pressed
 *    - {object} styles: { styles for each card }
 */
const StatsCards = (props) => {
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={2}
      sx={{ width: 'calc(100% + 16px)', ...props.styles }}
    >
      {props.cards.map((card, index) =>
        card.type === 'quantity' ? (
          <Grid
            key={index}
            item
            xs={(12 / props.cards.length) * 2}
            md={12 / props.cards.length}
          >
            <Paper sx={{ ...stylesPaper, ...card.styles }}>
              <Typography
                variant="body1"
                color="primary"
                children={card.title}
                sx={stylesCardTitle}
              />
              <Typography
                variant="h4"
                color="primary"
                children={`${card.quantity}`}
              />
            </Paper>
          </Grid>
        ) : card.type === 'button' ? (
          <Grid
            key={index}
            item
            xs={(12 / props.cards.length) * 2}
            md={12 / props.cards.length}
          >
            <Paper sx={{ ...stylesPaperButton, ...card.styles }}>
              <Typography
                variant="body1"
                color="primary"
                children={card.title}
                sx={{ ...stylesCardTitle, marginBottom: '0px' }}
              />
              <Typography
                variant="body2"
                color="primary"
                children={card.description}
                sx={{ marginTop: '0px' }}
              />
              {card.can ? (
                <Can {...card.can}>
                  <Grid container>
                    <Button
                      sx={stylesButtons}
                      variant="contained"
                      style={{
                        backgroundColor: theme.palette.info[500],
                        color: 'black',
                        textTransform: 'none',
                      }}
                      onClick={() => card.onClick(card)}
                      children={card.buttonTitle}
                    />
                  </Grid>
                </Can>
              ) : (
                <Grid container>
                  <Button
                    sx={stylesButtons}
                    variant="contained"
                    style={{
                      backgroundColor: theme.palette.info[500],
                      color: 'black',
                      textTransform: 'none',
                    }}
                    onClick={() => card.onClick(card)}
                    children={card.buttonTitle}
                  />
                </Grid>
              )}
            </Paper>
          </Grid>
        ) : (
          card.type === 'quantityButton' && (
            <Grid
              key={index}
              item
              xs={(12 / props.cards.length) * 2}
              md={12 / props.cards.length}
            >
              <Paper sx={{ ...stylesPaperButton, ...card.styles }}>
                <Grid item>
                  <Typography
                    variant="body1"
                    color="primary"
                    children={card.title}
                    sx={stylesCardTitle}
                  />
                </Grid>
                <Grid container>
                  <Typography
                    variant="h4"
                    color="primary"
                    children={card.quantity}
                  />
                  <Button
                    sx={stylesButtons}
                    variant="contained"
                    style={{
                      backgroundColor: theme.palette.info[500],
                      color: 'black',
                      textTransform: 'none',
                    }}
                    onClick={() => card.onClick(card)}
                    children={card.buttonTitle}
                  />
                </Grid>
              </Paper>
            </Grid>
          )
        )
      )}
    </Grid>
  );
};

export default React.memo(StatsCards);
