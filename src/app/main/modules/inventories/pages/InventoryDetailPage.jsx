import GeneralContainer from '@components/generalContainer/GeneralContainer';
import useInventoryDetail from '../hooks/useInventoryDetail';
import TabsComponent from '@components/tabs/TabsComponent';

const OrganizationPage = () => {
  //HOOKS

  const {
    propsTabsComponent,
    lastLocation,
    navigate,
    inventorySelected,
    params,
  } = useInventoryDetail();
  return (
    <GeneralContainer
      title={
        params.id_inventory != 0
          ? `Inventario ${inventorySelected?.name}`
          : 'Crear nuevo Inventario'
      }
      subtitle={
        params.id_inventory != 0
          ? ` ${inventorySelected?.branch} `
          : 'Detalle del inventario'
      }
      actions={[]}
      backTitle="Regresar"
      backFunction={() => {
        navigate(lastLocation);
      }}
      container={<TabsComponent nopaper {...propsTabsComponent()} />}
    />
  );
};
export default OrganizationPage;
