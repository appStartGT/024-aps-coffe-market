import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
import SearchBar from '@components/SearchBar';
import DataTableOverview from '../components/DataTableOverview';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const PurchaseDetailPricelessPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    purchaseListPriceless,
  } = usePurchaseDetail();

  return (
    <>
      <Paper sx={PAPER_STYLES}>
        <DataTableOverview purchaseList={purchaseListPriceless} />
        <SearchBar {...propsSearchBarButton} />
        <ApsDatagrid
          rows={searchList || purchaseListPriceless}
          columns={columns}
          loading={processing}
          sxContainerProps={{ height: 500 }}
          autoHeight={false}
        />
      </Paper>
    </>
  );
};

export default PurchaseDetailPricelessPage;
