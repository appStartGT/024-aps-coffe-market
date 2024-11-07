import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import useTruckload from '../hooks/useTruckload';
import SearchBar from '@components/SearchBar';
import DataTableOverview from '../components/DataTableOverview';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const TruckloadPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    truckloadList,
  } = useTruckload();

  return (
    <>
      <Paper sx={PAPER_STYLES}>
        <DataTableOverview truckloadList={truckloadList} />
        <SearchBar {...propsSearchBarButton} />
        <ApsDatagrid
          rows={searchList || truckloadList}
          columns={columns}
          loading={processing}
          sxContainerProps={{ height: 500 }}
          autoHeight={false}
        />
      </Paper>
    </>
  );
};

export default TruckloadPage;
