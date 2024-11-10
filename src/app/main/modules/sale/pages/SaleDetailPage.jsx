import React from 'react';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import useSaleDetail from '../hooks/useSaleDetail';
import TabsComponent from '@components/tabs/TabsComponent';

const SaleDetailPage = () => {
  //HOOKS

  const { propsTabsComponent, lastLocation, navigate, saleSelected, params } =
    useSaleDetail();

  return (
    <GeneralContainer
      title={
        params.id_sale !== '0'
          ? `Beneficio ${saleSelected?.name}`
          : 'Nuevo Beneficio'
      }
      subtitle={
        params.id_sale !== '0'
          ? `${saleSelected?.email}`
          : 'Detalles de la venta'
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
export default SaleDetailPage;
