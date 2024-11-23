import ApsDatagrid from '@components/ApsDatagrid';
import { Paper, Typography, Box, Button } from '@mui/material';
import usePurchaseDetail from '../hooks/usePurchaseDetail';
import DataTableOverview from '../components/DataTableOverview';
import { formatNumber } from '@utils';

const PAPER_STYLES = {
  padding: '16px',
  borderRadius: '12px',
};

const PurchaseDetailPricelessPage = () => {
  const {
    processing,
    columns,
    searchList,
    purchaseListPriceless,
    selectionModel,
    setSelectionModel,
    totalSelectedQuantity,
    handleRemate,
  } = usePurchaseDetail();

  const totalSelectedQuintales = totalSelectedQuantity / 100;

  return (
    <>
      <Paper sx={PAPER_STYLES}>
        <DataTableOverview purchaseList={purchaseListPriceless} />

        {selectionModel.length > 0 && (
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1">
              Total de libras seleccionadas:
              {formatNumber(totalSelectedQuantity)}
              &nbsp;({formatNumber(totalSelectedQuintales)} quintales)
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRemate}>
              Remate
            </Button>
          </Box>
        )}

        <ApsDatagrid
          rows={searchList || purchaseListPriceless}
          columns={columns}
          loading={processing}
          sxContainerProps={{ height: 500 }}
          autoHeight={false}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          isRowSelectable={(value) => !value.row.isRemate}
        />
      </Paper>
    </>
  );
};

export default PurchaseDetailPricelessPage;
