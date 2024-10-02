import { Box, Grid, Paper } from '@mui/material';
import * as React from 'react';
import TabsComponentHeaders from './TabsComponentHeaders';
import TabsComponentBody from './TabComponentBody';

/**
 * @param {array} tabs - array of tabs
 * @param {boolean} nopaper - tabs with no paper = true
 */
const TabsComponentV2 = ({ tabs, nopaper, onChange, selectedTab }) => {
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
    onChange && onChange(newValue);
  }
  React.useEffect(() => {
    if (selectedTab && !isNaN(selectedTab)) setValue(selectedTab);
  }, [selectedTab]);

  return (
    <Grid>
      <Paper sx={{ borderRadius: '12px' }}>
        <TabsComponentHeaders
          value={value}
          handleChange={handleChange}
          tabs={tabs}
        />
      </Paper>
      {nopaper ? (
        <Box style={{ padding: '0px !important' }}>
          <TabsComponentBody value={value} tabs={tabs} />
        </Box>
      ) : (
        <Paper sx={{ borderRadius: '12px', marginTop: '24px' }}>
          <TabsComponentBody value={value} tabs={tabs} />
        </Paper>
      )}
    </Grid>
  );
};

// export default React.memo(TabsComponentV2);
export default TabsComponentV2;
