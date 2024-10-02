import { Tab, Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';
import * as React from 'react';

const CustomTab = withStyles({
  root: {
    textTransform: 'none',
    fontSize: '1em',
  },
  selected: {
    fontWeight: 'bold',
  },
})(Tab);

const stylesTabs = {
  borderRadius: '12px',
  padding: '0px 8px',
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabsComponentHeaders = ({ value, handleChange, tabs }) => (
  <Tabs
    sx={stylesTabs}
    value={value}
    onChange={handleChange}
    variant="scrollable"
  >
    {tabs.map((tab, index) => (
      <CustomTab
        disabled={tab.disabled}
        label={tab.title}
        onClick={(e) => handleChange(e, index)}
        {...a11yProps(index)}
        key={index}
      />
    ))}
  </Tabs>
);

export default TabsComponentHeaders;
