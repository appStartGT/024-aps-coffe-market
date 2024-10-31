import ApsDatagrid from '@components/ApsDatagrid';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import { Paper } from '@mui/material';
import usePurchaseList from '../hooks/usePurchaseList';
import ApsModal from '@components/ApsModal';
import SearchBar from '@components/SearchBar';
import DataTableOverview from '../components/DataTableOverview';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const PurchaseListPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    purchaseList,
    propsModalDeletePurchase,
  } = usePurchaseList();
  return (
    <GeneralContainer
      title="Compras"
      subtitle="Listado de clentes."
      backTitle="Volver"
      actions={[]}
      buttonProps={{}}
      container={
        <>
          {propsModalDeletePurchase?.open && (
            <ApsModal {...propsModalDeletePurchase} />
          )}

          <Paper sx={stylesPaper}>
            <DataTableOverview purchaseList={purchaseList} />
            <SearchBar {...propsSearchBarButton} />
            <ApsDatagrid
              rows={searchList || purchaseList}
              columns={columns}
              loading={processing}
              sxContainerProps={{
                height: 500,
              }}
              autoHeight={false}
            />
          </Paper>
        </>
      }
    />
  );
};

export default PurchaseListPage;
