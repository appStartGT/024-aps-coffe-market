import GeneralContainer from '@components/generalContainer/GeneralContainer';
import useOrganizationDetail from '../hooks/useOrganizationDetail';
import TabsComponent from '@components/tabs/TabsComponent';

const OrganizationPage = () => {
  //HOOKS

  const {
    propsTabsComponent,
    lastLocation,
    navigate,
    organizationSelected,
    params,
    disableBreadcrumb,
  } = useOrganizationDetail();

  return (
    <GeneralContainer
      disableBreadcrumb={disableBreadcrumb}
      title={
        params.id_organization != 0
          ? `Organización ${organizationSelected?.name}`
          : 'Crear nueva organización'
      }
      subtitle={
        params.id_organization != 0
          ? ` ${organizationSelected?.email} `
          : 'Detalle de la organización'
      }
      actions={[]}
      backTitle="Regresar"
      backFunction={
        disableBreadcrumb
          ? null
          : () => {
              navigate(lastLocation);
            }
      }
      container={<TabsComponent nopaper {...propsTabsComponent()} />}
    />
  );
};
export default OrganizationPage;
