import React from 'react';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import useBeneficioDetail from '../hooks/useBeneficioDetail';
import TabsComponent from '@components/tabs/TabsComponent';

const BeneficioDetailPage = () => {
  //HOOKS

  const {
    propsTabsComponent,
    lastLocation,
    navigate,
    purchaseSelected,
    params,
  } = useBeneficioDetail();

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
export default BeneficioDetailPage;
