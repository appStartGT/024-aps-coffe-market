import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
import ApsModal from '@components/ApsModal';
import SearchBar from '@components/SearchBar';

const stylesPaper = {
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
    propsModalDeletePurchase,
  } = usePurchaseDetail();

  return (
    <>
      {propsModalDeletePurchase?.open && (
        <ApsModal {...propsModalDeletePurchase} />
      )}

      <Paper sx={stylesPaper}>
        <SearchBar {...propsSearchBarButton} />
        <ApsDatagrid
          rows={searchList.length > 0 ? searchList : purchaseList}
          columns={columns}
          loading={processing}
          sxContainerProps={{
            height: 500,
          }}
          autoHeight={false}
        />
      </Paper>
    </>
  );
};

export default PurchaseDetailPage;
