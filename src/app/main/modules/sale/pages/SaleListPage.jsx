import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import useSaleList from '../hooks/useSaleList';
import ApsModal from '@components/ApsModal';
import SearchBar from '@components/SearchBar';
import DataTableOverview from '../components/DataTableOverview';
import GeneralContainer from '@components/generalContainer/GeneralContainer';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const SaleListPage = () => {
  const {
    processing,
    propsSearchBarButton,
    columns,
    searchList,
    saleList,
    propsModalDeleteSale,
  } = useSaleList();
  return (
    <GeneralContainer
      title="Venta"
      subtitle="Listado de beneficios"
      actions={[]}
      container={
        <>
          {propsModalDeleteSale?.open && <ApsModal {...propsModalDeleteSale} />}

          <Paper sx={stylesPaper}>
            <DataTableOverview saleList={saleList} />
            <SearchBar {...propsSearchBarButton} />
            <ApsDatagrid
              rows={searchList || saleList}
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

export default SaleListPage;