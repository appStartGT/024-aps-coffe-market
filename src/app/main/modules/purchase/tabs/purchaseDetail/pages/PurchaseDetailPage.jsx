import ApsDatagrid from '@components/ApsDatagrid';
import { Paper } from '@mui/material';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
import DataTableOverview from '../components/DataTableOverview';
import { Box, Switch, FormControlLabel } from '@mui/material';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const PurchaseDetailPage = () => {
  const {
    processing,
    columns,
    /* searchList, */ purchaseList,
    getAll,
    setGetAll,
  } = usePurchaseDetail();

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
          {/* <Fab
            color="primary"
            size="small"
            aria-label="add"
            onClick={handleAdd}
          >
            <AddIcon />
          </Fab> */}
        </Box>
        {/* <SearchBar {...propsSearchBarButton} /> */}
        <ApsDatagrid
          rows={/* searchList || */ purchaseList}
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
