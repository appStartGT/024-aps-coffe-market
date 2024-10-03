import React from 'react';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
import TabsComponent from '@components/tabs/TabsComponent';

const PurchaseDetailPage = () => {
  //HOOKS

  const {
    propsTabsComponent,
    lastLocation,
    navigate,
    purchaseSelected,
    params,
  } = usePurchaseDetail();

  return (
    <GeneralContainer
      title={
        params.id_purchase != 0
          ? `Cliente ${purchaseSelected?.name}`
          : 'Nuevo Cliente'
      }
      subtitle={
        params.id_purchase != 0
          ? ` ${purchaseSelected?.email} `
          : 'Detalles del cliente'
      }
      actions={[]}
      backTitle="Volver"
      backFunction={() => {
        navigate(lastLocation);
      }}
      container={<TabsComponent nopaper {...propsTabsComponent()} />}
    />
  );
};
export default PurchaseDetailPage;
