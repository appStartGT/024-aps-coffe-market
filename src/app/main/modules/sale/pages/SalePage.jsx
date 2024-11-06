import React from 'react';
import TabsComponent from '@components/tabs/TabsComponent';
import useSale from '../hooks/useSale';

const SalePage = () => {
  const { tabProps } = useSale();

  return <TabsComponent nopaper tabs={tabProps} />;
};

export default SalePage;
