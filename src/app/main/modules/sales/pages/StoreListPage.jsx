import GeneralContainer from '@components/generalContainer/GeneralContainer';
import TabSales from './TabSales';

const StoreListPage = () => {
  return (
    <GeneralContainer
      title="Ventas"
      subtitle="Módulo de ventas."
      actions={[]}
      buttonProps={null}
      container={<TabSales />}
    />
  );
};

export default StoreListPage;
