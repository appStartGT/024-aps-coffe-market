import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
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
    searchList,
    purchaseList,
  } = usePurchaseDetail();

  return (
    <>
      <Paper sx={PAPER_STYLES}>
        <DataOverview purchaseList={purchaseList} />
        <SearchBar {...propsSearchBarButton} />
        <ApsDatagrid
          rows={searchList || purchaseList}
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
