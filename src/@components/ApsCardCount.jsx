import React from 'react';
import Muipaper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';

const Paper = styled(Muipaper)(({ theme }) => ({
  ...theme.typography.body2,
  borderRadius: '15px',
  color: theme.palette.text.primary.main,
  height: '322px',
  maxWidth: '100%',
  maxHeight: '100%',
  padding: '20px',
}));
const Img = styled('img')({
  margin: 'auto',
  marginRight: '-10px',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
  width: '315px',
  height: '180px',
  marginTop: '-40px',
});

const fontStyle = {
  '& .MuiTypography-root': {
    fontSize: '80px',
    paddingLeft: '10px',
  },
};

const ApsCardCount = ({ title, subtitle, count, img }) => {
  return (
    <Paper>
      <Grid>
        <Typography children={title} variant="h2" color="primary" />
      </Grid>
      <Grid>
        <Typography children={subtitle} variant="subtitle2" />
        <Grid sx={{ ...fontStyle }}>
          <Typography
            variant="h1"
            component="div"
            color="primary"
            children={count}
          />
        </Grid>
        <Grid>
          <div>
            <Img src={img} />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default React.memo(ApsCardCount);
