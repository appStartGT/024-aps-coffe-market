import GeneralContainer from '@components/generalContainer/GeneralContainer';
import useBranchDetail from '../hooks/useBranchDetail';
import TabsComponent from '@components/tabs/TabsComponent';

const BranchDetailPage = () => {
  //HOOKS

  const { propsTabsComponent, lastLocation, navigate, branchSelected, params } =
    useBranchDetail();

  return (
    <GeneralContainer
      title={
        params.id_branch != 0
          ? `Sucursal ${branchSelected?.name}`
          : 'Crear nueva Sucursal'
      }
      subtitle={
        params.id_branch != 0
          ? ` ${branchSelected?.email} `
          : 'Detalle de la Sucursal'
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
export default BranchDetailPage;
