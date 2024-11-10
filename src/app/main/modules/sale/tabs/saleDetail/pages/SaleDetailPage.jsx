import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import useSaleDetail from '../hooks/useSaleDetail';
// import SearchBar from '@components/SearchBar';
import DataTableOverview from '../components/DataTableOverview';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const SaleDetailPage = () => {
  const {
    processing,
    /* propsSearchBarButton, */ columns,
    searchList,
    saleList,
  } = useSaleDetail();

  return (
    <>
      <Paper sx={PAPER_STYLES}>
        <DataTableOverview purchaseList={saleList} />
        {/* <SearchBar {...propsSearchBarButton} /> */}
        <ApsDatagrid
          rows={searchList || saleList}
          columns={columns}
          loading={processing}
          sxContainerProps={{ height: 500 }}
          autoHeight={false}
        />
      </Paper>
    </>
  );
};

export default SaleDetailPage;
