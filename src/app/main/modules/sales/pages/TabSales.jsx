import { Paper } from '@mui/material';
import SearchBar from '@components/SearchBar';
import ApsDatagrid from '@components/ApsDatagrid';
import useTabSales from '../hooks/useTabSales';
import SalesModal from '../components/SalesModal';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const TabSales = () => {
  const { columns, list, loading, propsSearchBarButton, searchList } =
    useTabSales();

  return (
    <Paper sx={stylesPaper}>
      <SearchBar {...propsSearchBarButton} />
      <ApsDatagrid
        rows={searchList || list}
        columns={columns}
        loading={loading}
        sxContainerProps={{
          height: 500,
        }}
        autoHeight={false}
      />
      <SalesModal />
    </Paper>
  );
};

export default TabSales;
