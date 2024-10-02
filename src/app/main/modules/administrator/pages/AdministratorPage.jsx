import GeneralContainer from '@components/generalContainer/GeneralContainer';
import useAdminstrator from '../hooks/useAdminstrator';
import TabsComponent from '@components/tabs/TabsComponent';

const AdministratorPage = () => {
  //HOOKS
  const { propsTabsComponent, selectedTab } = useAdminstrator();

  return (
    <GeneralContainer
      title={'Administrador'}
      subtitle="Administrar usuarios y roles."
      actions={[]}
      container={
        <TabsComponent
          nopaper
          {...propsTabsComponent()}
          selectedTab={selectedTab}
        />
      }
    />
  );
};
export default AdministratorPage;
