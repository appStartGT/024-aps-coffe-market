import GeneralContainer from '@components/generalContainer/GeneralContainer';
import useOrganizationDetail from '../hooks/useEmployeeDetail';
import TabsComponent from '@components/tabs/TabsComponent';

const OrganizationPage = () => {
  //HOOKS

  const {
    propsTabsComponent,
    lastLocation,
    navigate,
    employeeSelected,
    params,
  } = useOrganizationDetail();

  return (
    <GeneralContainer
      title={
        params.id_employee != 0
          ? `Empleado ${employeeSelected?.name}`
          : 'Crear nueva empleado'
      }
      subtitle={
        params.id_employee != 0
          ? ` ${employeeSelected?.email} `
          : 'Detalle de la empleado'
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
