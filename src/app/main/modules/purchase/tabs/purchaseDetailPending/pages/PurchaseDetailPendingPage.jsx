import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import usePurchaseDetailPending from '../hooks/usePurchaseDetailPending';
import DataTableOverview from '../components/DataTableOverview';
import { Box, Switch, FormControlLabel } from '@mui/material';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const PurchaseDetailPendingPage = () => {
  const {
    processing,
    columns,
    purchaseList,
    getAll,
    setGetAll,
  } = usePurchaseDetailPending();

  return (
    <>
      <Paper sx={PAPER_STYLES}>
        <DataTableOverview purchaseList={purchaseList} />
        <Box
          display="flex"
          justifyContent="space-between"
          gap={2}
          marginBottom={2}
        >
          <FormControlLabel
            control={<Switch onChange={() => setGetAll(!getAll)} />}
            label="Ver todo"
          />
        </Box>
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

export default PurchaseDetailPendingPage;
