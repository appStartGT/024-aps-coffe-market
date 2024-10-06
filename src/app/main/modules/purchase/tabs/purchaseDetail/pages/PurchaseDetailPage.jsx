import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
import ApsModal from '@components/ApsModal';
import SearchBar from '@components/SearchBar';
import DataOverview from '../components/DataOverview';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const PurchaseDetailPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    purchaseList,
    propsModalDeletePurchase,
  } = usePurchaseDetail();

  return (
    <>
      {propsModalDeletePurchase?.open && (
        <ApsModal {...propsModalDeletePurchase} />
      )}

      <Paper sx={PAPER_STYLES}>
        <DataOverview />
        <SearchBar {...propsSearchBarButton} />
        <ApsDatagrid
          rows={purchaseList}
          columns={columns}
          loading={processing}
          sxContainerProps={{ height: 500 }}
          autoHeight={false}
        />
      </Paper>
    </>
  );
};

export default PurchaseDetailPage;
