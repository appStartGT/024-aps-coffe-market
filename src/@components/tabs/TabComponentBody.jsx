import * as React from 'react';

function TabPanel(props) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ borderRadius: '12px', marginTop: '24px', ...sx }}
      {...other}
    >
      {value === index && <> {children} </>}
    </div>
  );
}

const TabsComponentBody = ({ value, tabs }) =>
  tabs.map((tab, index) => (
    <TabPanel value={value} index={index} sx={tab.contentStyles} key={index}>
      {tab.content}
    </TabPanel>
  ));

export default TabsComponentBody;
